import catalog from "virtual:neica-catalog";
export const siteUrl = (route = "") =>
  `${import.meta.env.BASE_URL}${route.replace(/^\//, "")}`;
export const assetUrl = (relative: string) =>
  `${catalog.mode === "review" ? "/__review__/" : import.meta.env.BASE_URL}${relative}`;
export const isSafeLink = (href: string) =>
  !/[\\\s]/.test(href) &&
  (/^(https?:\/\/|mailto:)/i.test(href) || /^\/(?!\/)/.test(href));
export function destination(href: string) {
  return href.startsWith("/") ? siteUrl(href) : href;
}
