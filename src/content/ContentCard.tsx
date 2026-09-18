import { useState, type MouseEvent } from "react";
import type { Card, Locale } from "../types";
import { assetUrl, destination, localizedSiteUrl } from "../lib/urls";
import Icon from "../components/Icon";
import { copy } from "../app/i18n";
export default function ContentCard({
  card,
  index,
  locale,
  onOpen,
}: {
  card: Card;
  index: number;
  locale: Locale;
  onOpen: (card: Card) => void;
}) {
  const [failed, setFailed] = useState(false);
  const text = copy[locale].card;
  const href =
    card.kind === "link"
      ? destination(card.href)
      : localizedSiteUrl("", locale, { post: card.id, slide: 1 });
  function click(event: MouseEvent<HTMLAnchorElement>) {
    if (
      card.kind === "carousel" &&
      !event.metaKey &&
      !event.ctrlKey &&
      !event.shiftKey &&
      !event.altKey
    ) {
      event.preventDefault();
      onOpen(card);
    }
  }
  const thumb = card.cover.variants?.[0]?.path || card.cover.path;
  return (
    <article className="content-card">
      <a
        className="card-link"
        href={href}
        onClick={click}
        target={card.kind === "link" && card.external ? "_blank" : undefined}
        rel={
          card.kind === "link" && card.external
            ? "noopener noreferrer"
            : undefined
        }
        aria-label={`${card.title}, ${
          card.kind === "carousel"
            ? text.slides(card.slideCount)
            : card.external
              ? text.external
              : text.internal
        }`}
      >
        {failed ? (
          <span className="cover-error">
            {card.title}
            <span>{text.imageError}</span>
          </span>
        ) : (
          <img
            src={assetUrl(thumb)}
            srcSet={card.cover.variants
              ?.map((v) => `${assetUrl(v.path)} ${v.width}w`)
              .join(", ")}
            sizes="(min-width: 1100px) calc((min(100vw, 1760px) - 2 * clamp(80px, 10vw, 160px) - 96px) / 3), (min-width: 700px) calc((100vw - 128px) / 2), calc(100vw - 48px)"
            width={card.cover.width}
            height={card.cover.height}
            alt=""
            loading={index < 3 ? "eager" : "lazy"}
            decoding="async"
            fetchPriority={index === 0 ? "high" : "auto"}
            onError={() => setFailed(true)}
          />
        )}
        {card.kind === "link" && (
          <span className="card-external">
            <Icon name="external" />
          </span>
        )}
      </a>
    </article>
  );
}
