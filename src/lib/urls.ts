import catalogs from "virtual:neica-catalog";
import type { Locale } from "../types";
export const siteUrl = (route = "") =>
  `${import.meta.env.BASE_URL}${route.replace(/^\//, "")}`;
export const assetUrl = (relative: string) =>
  `${catalogs.ko.mode === "review" ? "/__review__/" : import.meta.env.BASE_URL}${relative}`;
export function localizedSiteUrl(
  route = "",
  locale: Locale = "ko",
  values: Record<string, string | number | undefined> = {},
) {
  const params = new URLSearchParams();
  if (locale === "en") params.set("lang", "en");
  for (const [key, value] of Object.entries(values))
    if (value !== undefined) params.set(key, String(value));
  const search = params.toString();
  return `${siteUrl(route)}${search ? `?${search}` : ""}`;
}
export function languageUrl(locale: Locale) {
  const url = new URL(window.location.href);
  if (locale === "en") url.searchParams.set("lang", "en");
  else url.searchParams.delete("lang");
  return `${url.pathname}${url.search}${url.hash}`;
}
export const isSafeLink = (href: string) =>
  !/[\\\s]/.test(href) &&
  (/^(https?:\/\/|mailto:)/i.test(href) || /^\/(?!\/)/.test(href));
export function destination(href: string) {
  return href.startsWith("/") ? siteUrl(href) : href;
}
