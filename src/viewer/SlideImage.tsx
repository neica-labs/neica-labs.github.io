import { useEffect, useState } from "react";
import type { Slide } from "../types";
import { assetUrl } from "../lib/urls";
const cache = new Map<string, Promise<void>>();
export function preloadImage(src: string) {
  if (cache.has(src)) return cache.get(src)!;
  const task = new Promise<void>((resolve, reject) => {
    const image = new Image();
    image.onload = () => {
      image.decode().then(() => resolve(), reject);
    };
    image.onerror = () => reject(new Error("Image failed"));
    image.src = src;
  });
  cache.set(src, task);
  task.catch(() => cache.delete(src));
  while (cache.size > 5) cache.delete(cache.keys().next().value!);
  return task;
}
export default function SlideImage({
  slide,
  style,
}: {
  slide: Slide;
  style: React.CSSProperties;
}) {
  const src = assetUrl(slide.image.path);
  const [state, setState] = useState({ src: "", status: "loading" });
  const [attempt, setAttempt] = useState(0);
  useEffect(() => {
    let active = true;
    setState({ src, status: "loading" });
    preloadImage(src).then(
      () => {
        if (active) setState({ src, status: "ready" });
      },
      () => {
        if (active) setState({ src, status: "error" });
      },
    );
    return () => {
      active = false;
    };
  }, [src, attempt]);
  const status = state.src === src ? state.status : "loading";
  return (
    <>
      {status === "ready" ? (
        <img
          className="slide-image"
          key={src}
          src={src}
          width={slide.image.width}
          height={slide.image.height}
          alt={slide.image.alt}
          style={style}
          draggable={false}
          aria-describedby="slide-transcript"
        />
      ) : (
        <div className="viewer-message" role="status">
          {status === "error" ? (
            <>
              <p>이미지를 불러오지 못했습니다.</p>
              <button
                onPointerDown={(e) => e.stopPropagation()}
                onClick={() => setAttempt((n) => n + 1)}
              >
                다시 시도
              </button>
            </>
          ) : (
            <span className="loading-dot" aria-label="이미지 불러오는 중" />
          )}
        </div>
      )}
      <span id="slide-transcript" className="sr-only">
        {slide.text}
      </span>
    </>
  );
}
