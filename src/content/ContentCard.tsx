import { useState, type MouseEvent } from "react";
import type { Card } from "../types";
import { assetUrl, destination, siteUrl } from "../lib/urls";
import Icon from "../components/Icon";
export default function ContentCard({
  card,
  index,
  onOpen,
}: {
  card: Card;
  index: number;
  onOpen: (card: Card) => void;
}) {
  const [failed, setFailed] = useState(false);
  const href =
    card.kind === "link"
      ? destination(card.href)
      : `${siteUrl()}?post=${encodeURIComponent(card.id)}&slide=1`;
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
        aria-label={`${card.title}${card.kind === "carousel" ? `, ${card.slideCount}장 슬라이드 열기` : card.external ? ", 새 탭에서 열기" : ", 페이지로 이동"}`}
      >
        {failed ? (
          <span className="cover-error">
            {card.title}
            <span>이미지를 불러오지 못했습니다</span>
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
