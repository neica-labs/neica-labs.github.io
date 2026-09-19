import { navigation } from "./siteConfig";
import { languageUrl, localizedSiteUrl, siteUrl } from "../lib/urls";
import { copy } from "./i18n";
import type { Locale } from "../types";
export default function SiteHeader({
  page,
  locale,
}: {
  page: string;
  locale: Locale;
}) {
  const text = copy[locale];
  return (
    <header className="site-header">
      <div className="header-inner">
        <div className="brand-identity">
          <a
            className="wordmark"
            href={localizedSiteUrl("", locale)}
            aria-label={text.homeLabel}
          >
            <img
              src={siteUrl("brand/neica-wordmark-source.png")}
              alt="NEICA"
            />
          </a>
          <span className="brand-tagline">for the immeasurable world</span>
        </div>
        <div className="header-end">
          <nav aria-label={text.mainLabel}>
            {navigation.map((item) => (
              <a
                key={item.id}
                href={localizedSiteUrl(item.path, locale)}
                aria-current={page === item.id ? "page" : undefined}
              >
                {item.label}
              </a>
            ))}
          </nav>
          <div className="language-switch" aria-label={text.language}>
            <a
              href={languageUrl("ko")}
              aria-current={locale === "ko" ? "true" : undefined}
              lang="ko"
            >
              KO
            </a>
            <span aria-hidden="true">/</span>
            <a
              href={languageUrl("en")}
              aria-current={locale === "en" ? "true" : undefined}
              lang="en"
            >
              EN
            </a>
          </div>
        </div>
      </div>
    </header>
  );
}
