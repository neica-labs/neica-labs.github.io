import { navigation } from "./siteConfig";
import { languageUrl, localizedSiteUrl } from "../lib/urls";
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
        <div className="header-start">
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
          <a
            className="wordmark"
            href={localizedSiteUrl("", locale)}
            aria-label={text.homeLabel}
          >
            NEICA
          </a>
        </div>
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
      </div>
    </header>
  );
}
