export type ImageAsset = {
  path: string;
  width: number;
  height: number;
  alt: string;
  variants?: { path: string; width: number }[];
};
export type CardBase = {
  id: string;
  revision: string;
  title: string;
  cover: ImageAsset;
  displayDate: string;
};
export type Card = CardBase &
  (
    | { kind: "carousel"; slideCount: number; postPath: string }
    | { kind: "link"; href: string; external: boolean }
  );
export type Catalog = {
  schemaVersion: string;
  mode: "publish" | "review";
  buildId: string;
  entries: Card[];
  warnings?: string[];
};
export type Slide = { id: string; image: ImageAsset; text: string };
export type Post = {
  schemaVersion: string;
  id: string;
  revision: string;
  title: string;
  slides: Slide[];
  caption: {
    body: string;
    cta: string;
    hashtags: string[];
    attributions: string[];
  };
  sources: { title: string; url: string; publisher?: string }[];
};
