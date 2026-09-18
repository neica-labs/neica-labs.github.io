import { useEffect, useRef, useState } from "react";
import type { Card, Locale, Post } from "../types";
import { assetUrl, destination, isSafeLink } from "../lib/urls";
import Icon from "../components/Icon";
import { copy } from "../app/i18n";
import SlideImage, { preloadImage } from "./SlideImage";
import useZoomPan from "./useZoomPan";

export default function CarouselViewer({
  card,
  index,
  locale,
  onGo,
  onClose,
}: {
  card: Card | undefined;
  index: number;
  locale: Locale;
  onGo: (index: number) => void;
  onClose: () => void;
}) {
  const text = copy[locale].viewer;
  const dialog = useRef<HTMLDialogElement>(null),
    closeButton = useRef<HTMLButtonElement>(null);
  const [loaded, setLoaded] = useState<{ key: string; post: Post } | null>(
      null,
    ),
    [error, setError] = useState(false),
    [attempt, setAttempt] = useState(0);
  const [info, setInfo] = useState(false);
  const post = loaded && loaded.key === card?.revision ? loaded.post : null;
  const slide = post?.slides[index];
  const pan = useZoomPan(
    slide?.image.path || "",
    slide?.image || { width: 1080, height: 1350 },
    (direction) => {
      const next = index + direction;
      if (post && next >= 0 && next < post.slides.length) onGo(next);
    },
  );
  const zoom = pan.zoom;
  useEffect(() => {
    const previous = document.activeElement as HTMLElement | null;
    const scrollY = window.scrollY;
    const previousStyle = {
      position: document.body.style.position,
      top: document.body.style.top,
      width: document.body.style.width,
      overflow: document.body.style.overflow,
    };
    Object.assign(document.body.style, {
      position: "fixed",
      top: `-${scrollY}px`,
      width: "100%",
      overflow: "hidden",
    });
    dialog.current?.showModal();
    closeButton.current?.focus();
    return () => {
      dialog.current?.close();
      Object.assign(document.body.style, previousStyle);
      window.scrollTo(0, scrollY);
      previous?.focus({ preventScroll: true });
    };
  }, []);
  useEffect(() => {
    if (!card || card.kind !== "carousel") return;
    const controller = new AbortController();
    setError(false);
    fetch(assetUrl(card.postPath), { signal: controller.signal })
      .then((r) => {
        if (!r.ok) throw Error();
        return r.json();
      })
      .then((p: Post) => {
        if (
          p.schemaVersion !== "neica-post.v1" ||
          p.id !== card.id ||
          p.revision !== card.revision ||
          !Array.isArray(p.slides) ||
          p.slides.length !== card.slideCount ||
          !p.slides.length
        )
          throw Error();
        if (!controller.signal.aborted)
          setLoaded({ key: card.revision, post: p });
      })
      .catch(() => {
        if (!controller.signal.aborted) setError(true);
      });
    return () => controller.abort();
  }, [card, attempt]);
  useEffect(() => {
    if (post && index >= post.slides.length) onGo(post.slides.length - 1);
  }, [post, index, onGo]);
  useEffect(() => {
    setInfo(false);
    if (post)
      for (const n of [index - 1, index + 1])
        if (post.slides[n])
          preloadImage(assetUrl(post.slides[n].image.path)).catch(() => {});
  }, [index, post]);
  const latest = useRef({ post, index, onGo, onClose, info, pan });
  latest.current = { post, index, onGo, onClose, info, pan };
  useEffect(() => {
    const handle = (event: KeyboardEvent) => {
      if (event.ctrlKey || event.metaKey || event.altKey) return;
      const { post, index, onGo, info, pan } = latest.current;
      if (!post || info) return;
      if (event.key === "ArrowRight" && index < post.slides.length - 1) {
        event.preventDefault();
        onGo(index + 1);
      }
      if (event.key === "ArrowLeft" && index > 0) {
        event.preventDefault();
        onGo(index - 1);
      }
      if (event.key === "+" || event.key === "=") {
        event.preventDefault();
        pan.zoomBy(0.25);
      }
      if (event.key === "-") {
        event.preventDefault();
        pan.zoomBy(-0.25);
      }
      if (event.key === "0") pan.reset();
    };
    window.addEventListener("keydown", handle);
    return () => window.removeEventListener("keydown", handle);
  }, []);
  return (
    <dialog
      ref={dialog}
      className="carousel-viewer"
      aria-labelledby="viewer-title"
      onCancel={(event) => {
        event.preventDefault();
        onClose();
      }}
    >
      <h2 id="viewer-title" className="sr-only">
        {card?.title || text.untitled}
      </h2>
      <button
        className="viewer-button viewer-close"
        ref={closeButton}
        onClick={onClose}
        aria-label={text.close}
      >
        <Icon name="close" />
      </button>
      {!card ? (
        <div className="viewer-message">
          <p>{text.missing}</p>
          <button onClick={onClose}>{text.back}</button>
        </div>
      ) : error ? (
        <div className="viewer-message">
          <p>{text.loadError}</p>
          <button onClick={() => setAttempt((n) => n + 1)}>{text.retry}</button>
        </div>
      ) : !slide ? (
        <div className="viewer-message">
          <span className="loading-dot" aria-label={text.loading} />
        </div>
      ) : (
        <>
          <div
            className="image-surface"
            ref={pan.surface}
            {...pan.bindings}
            style={{ cursor: zoom > 1 ? "grab" : "default" }}
          >
            <SlideImage slide={slide} style={pan.style} />
          </div>
          <button
            className="viewer-button viewer-prev"
            disabled={index === 0}
            onClick={() => onGo(index - 1)}
            aria-label={text.previous}
          >
            <Icon name="left" />
          </button>
          <button
            className="viewer-button viewer-next"
            disabled={index === post!.slides.length - 1}
            onClick={() => onGo(index + 1)}
            aria-label={text.next}
          >
            <Icon name="right" />
          </button>
          <div className="viewer-toolbar">
            <span className="slide-counter" aria-live="polite">
              {String(index + 1).padStart(2, "0")} /{" "}
              {String(post!.slides.length).padStart(2, "0")}
            </span>
            <span className="toolbar-divider" />
            <button
              className="viewer-button"
              disabled={zoom <= 0.5}
              onClick={() => pan.zoomBy(-0.25)}
              aria-label={text.zoomOut}
            >
              <Icon name="minus" />
            </button>
            <button
              className="zoom-value"
              onClick={pan.reset}
              aria-label={text.fit}
            >
              {Math.round(zoom * 100)}%
            </button>
            <button
              className="viewer-button"
              disabled={zoom >= 4}
              onClick={() => pan.zoomBy(0.25)}
              aria-label={text.zoomIn}
            >
              <Icon name="plus" />
            </button>
            <button
              className="viewer-button"
              onClick={pan.reset}
              aria-label={text.reset}
            >
              <Icon name="fit" />
            </button>
            <span className="toolbar-divider" />
            <button
              className="viewer-button"
              onClick={() => setInfo((x) => !x)}
              aria-label={text.info}
              aria-expanded={info}
            >
              <Icon name="info" />
            </button>
          </div>
          {info && (
            <section className="post-info" aria-label={text.info}>
              <h3>{post!.title}</h3>
              <p>{post!.caption.body}</p>
              {post!.caption.cta && <p>{post!.caption.cta}</p>}
              <p className="info-hashtags">
                {post!.caption.hashtags
                  .map((tag) => (tag.startsWith("#") ? tag : `#${tag}`))
                  .join(" ")}
              </p>
              <details>
                <summary>{text.currentSlide}</summary>
                <p>{slide.text}</p>
              </details>
              {post!.caption.attributions.length > 0 && (
                <ul aria-label={text.credits}>
                  {post!.caption.attributions.map((credit, i) => (
                    <li key={i}>{credit}</li>
                  ))}
                </ul>
              )}
              {post!.sources.length > 0 && (
                <ul aria-label={text.sources}>
                  {post!.sources
                    .filter((s) => isSafeLink(s.url))
                    .map((s, i) => (
                      <li key={i}>
                        <a
                          href={destination(s.url)}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {s.title} ↗
                        </a>
                      </li>
                    ))}
                </ul>
              )}
            </section>
          )}
        </>
      )}
    </dialog>
  );
}
