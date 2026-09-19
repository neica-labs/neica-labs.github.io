import { createRoot } from "react-dom/client";
import catalogs from "virtual:neica-catalog";
import SiteHeader from "./app/SiteHeader";
import ContentCard from "./content/ContentCard";
import CarouselViewer from "./viewer/CarouselViewer";
import useViewerUrl from "./viewer/useViewerUrl";
import { localizedSiteUrl } from "./lib/urls";
import { applyDocumentLocale, copy, readLocale } from "./app/i18n";
import type { Catalog, Locale } from "./types";
import "./styles.css";

function Lines({ children }: { children: string }) {
  return <>{children.replaceAll("\n", " ")}</>;
}

function Emphasis({ children, phrases }: { children: string; phrases: readonly string[] }) {
  const pattern = new RegExp(`(${phrases.map((phrase) => phrase.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")).join("|")})`, "g");
  return <>{children.split(pattern).map((part, index) =>
    phrases.includes(part) ? <strong key={index}>{part}</strong> : part
  )}</>;
}

function Labs({ locale, catalog }: { locale: Locale; catalog: Catalog }) {
  const viewer = useViewerUrl(locale);
  const text = copy[locale];
  return (
    <>
      <main id="main" className="home-content">
        <h1 className="sr-only">{text.labs.srTitle}</h1>
        {catalog.entries.length ? (
          <div className="content-grid">
            {catalog.entries.map((card, index) => (
              <ContentCard
                key={card.id}
                card={card}
                index={index}
                locale={locale}
                onOpen={(card) => viewer.open(card.id)}
              />
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <p>{text.labs.empty}</p>
            <a href={localizedSiteUrl("about/", locale)}>{text.labs.about}</a>
          </div>
        )}
        <section
          className="labs-statement"
          aria-labelledby="labs-statement-title"
        >
          <span className="page-label">LABS</span>
          <h2 id="labs-statement-title">
            <Lines>{text.labs.heading}</Lines>
          </h2>
          <div className="prose">
            <p>
              {text.labs.lead} {text.labs.body}
            </p>
          </div>
        </section>
      </main>
      {viewer.id && (
        <CarouselViewer
          card={catalog.entries.find(
            (card) => card.id === viewer.id && card.kind === "carousel",
          )}
          index={viewer.index}
          locale={locale}
          onGo={viewer.go}
          onClose={viewer.close}
        />
      )}
    </>
  );
}

function ContactIcon({ type }: { type: "email" | "instagram" }) {
  if (type === "email")
    return (
      <svg aria-hidden="true" viewBox="0 0 24 24">
        <rect x="2.5" y="4.5" width="19" height="15" rx="1.5" />
        <path d="m3.5 6 8.5 7 8.5-7" />
      </svg>
    );
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24">
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle className="contact-icon-dot" cx="17.4" cy="6.7" r="1" />
    </svg>
  );
}

function Page({ page, locale }: { page: string; locale: Locale }) {
  const text = copy[locale];
  if (page === "about")
    return (
      <main className="text-page" id="main">
        <span className="page-label">ABOUT</span>
        <h1>
          <Lines>{text.about.heading}</Lines>
        </h1>
        <div className="prose">
          <p><Emphasis phrases={text.about.emphasis}>{text.about.lead}</Emphasis></p>
          <section>
            <h2>{text.about.humanHeading}</h2>
            <p><Emphasis phrases={text.about.emphasis}>{text.about.humanBody}</Emphasis></p>
          </section>
          <section>
            <h2>{text.about.focusHeading}</h2>
            <p><Emphasis phrases={text.about.emphasis}>{text.about.focusBody}</Emphasis></p>
            <p>{text.about.nameBody}</p>
          </section>
          <section>
            <h2>{text.about.technologyHeading}</h2>
            <p><Emphasis phrases={text.about.emphasis}>{text.about.technologyBody}</Emphasis></p>
          </section>
          <section>
            <h2>{text.about.choiceHeading}</h2>
            <p><Emphasis phrases={text.about.emphasis}>{text.about.choiceBody}</Emphasis></p>
          </section>
        </div>
      </main>
    );
  if (page === "community")
    return (
      <main className="text-page" id="main">
        <span className="page-label">COMMUNITY</span>
        <h1>
          <Lines>{text.community.heading}</Lines>
        </h1>
        <div className="prose">
          <p>
            {text.community.lead} {text.community.body}
          </p>
        </div>
      </main>
    );
  if (page === "contact")
    return (
      <main className="text-page contact-page" id="main">
        <span className="page-label">CONTACT</span>
        <h1>
          <Lines>{text.contact.heading}</Lines>
        </h1>
        <div className="contact-list" aria-label={text.contact.listLabel}>
          <a className="contact-link" href="mailto:neica.labs@gmail.com">
            <span className="contact-copy">
              <span className="contact-meta">{text.contact.email}</span>
              <span className="contact-address">neica.labs@gmail.com</span>
            </span>
            <span className="contact-icon">
              <ContactIcon type="email" />
            </span>
          </a>
          <a
            className="contact-link"
            href="https://www.instagram.com/neica.labs/"
            target="_blank"
            rel="noreferrer"
          >
            <span className="contact-copy">
              <span className="contact-meta">{text.contact.instagram}</span>
              <span className="contact-address">instagram.com/neica.labs</span>
            </span>
            <span className="contact-icon">
              <ContactIcon type="instagram" />
            </span>
          </a>
        </div>
      </main>
    );
  return (
    <main className="text-page" id="main">
      <span className="page-label">404</span>
      <h1>
        <Lines>{text.notFound.heading}</Lines>
      </h1>
      <a href={localizedSiteUrl("", locale)}>{text.notFound.back}</a>
    </main>
  );
}

const page = document.body.dataset.page || "home";
const locale = readLocale();
const catalog = catalogs[locale];
const text = copy[locale];
applyDocumentLocale(page, locale);

createRoot(document.getElementById("root")!).render(
  <>
    <a className="skip-link" href="#main">
      {text.skip}
    </a>
    <SiteHeader page={page} locale={locale} />
    {page === "labs" || page === "home" ? (
      <Labs locale={locale} catalog={catalog} />
    ) : (
      <Page page={page} locale={locale} />
    )}
    <footer className="site-copyright">©2026 NEICA. All rights reserved.</footer>
  </>,
);
