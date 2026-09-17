import { createRoot } from "react-dom/client";
import catalog from "virtual:neica-catalog";
import SiteHeader from "./app/SiteHeader";
import ContentCard from "./content/ContentCard";
import CarouselViewer from "./viewer/CarouselViewer";
import useViewerUrl from "./viewer/useViewerUrl";
import { siteUrl } from "./lib/urls";
import "./styles.css";

function Labs() {
  const viewer = useViewerUrl();
  return (
    <>
      <main id="main" className="home-content">
        <h1 className="sr-only">NEICA LABS 콘텐츠</h1>
        {catalog.entries.length ? (
          <div className="content-grid">
            {catalog.entries.map((card, index) => (
              <ContentCard
                key={card.id}
                card={card}
                index={index}
                onOpen={(card) => viewer.open(card.id)}
              />
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <p>첫 번째 이야기를 준비하고 있습니다.</p>
            <a href={siteUrl("about/")}>NEICA 알아보기 ↗</a>
          </div>
        )}
        <section
          className="labs-statement"
          aria-labelledby="labs-statement-title"
        >
          <span className="page-label">LABS</span>
          <h2 id="labs-statement-title">
            기술의 자리를
            <br />
            다시 생각합니다.
          </h2>
          <div className="prose">
            <p className="lead">
              손에 닿는 도구, 생활 속의 작은 경계, 함께 만드는 습관을
              연구합니다.
            </p>
            <p>
              스마트폰에 모인 기능을 사물과 공간으로 나누고, 행동을 바꿀 수 있는
              환경을 실험합니다.
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

function Page({ page }: { page: string }) {
  if (page === "about")
    return (
      <main className="text-page" id="main">
        <span className="page-label">ABOUT</span>
        <h1>
          측정할 수 없는
          <br />
          세계를 위해.
        </h1>
        <div className="prose">
          <p className="lead">
            NEICA labs는 효율과 최적화만으로 설명되지 않는 인간의 선택을 지키며,
            기술이 삶에서 차지하는 자리를 다시 설계합니다.
          </p>
          <p>
            기술을 덜 쓰는 것 자체가 목적은 아닙니다. 기술이 사람의
            주의·시간·행동을 대신 결정하지 않도록, 필요한 기능은 가까이 두고
            불필요한 요구는 주변으로 물러나게 하는 도구와 환경을 연구합니다.
          </p>
          <section>
            <h2>NEICA가 기억하는 다섯 단어</h2>
            <div className="name-meaning" aria-label="NEICA 이름의 의미">
              <div>
                <strong>N</strong>
                <span>noise</span>
                <small>소음</small>
              </div>
              <div>
                <strong>E</strong>
                <span>error</span>
                <small>오류</small>
              </div>
              <div>
                <strong>I</strong>
                <span>inefficient</span>
                <small>비효율적인 것</small>
              </div>
              <div>
                <strong>C</strong>
                <span>constraint</span>
                <small>제약</small>
              </div>
              <div>
                <strong>A</strong>
                <span>ambiguous</span>
                <small>모호함</small>
              </div>
            </div>
            <p>
              최적화의 언어에서는 제거해야 할 값처럼 보이지만, 인간의 삶에서는
              탐색·학습·숙련·책임·해석이 시작되는 조건이기도 합니다. NEICA는 이
              다섯 단어를 기술이 함부로 지워서는 안 될 인간적 영역을 기억하는
              이름으로 사용합니다.
            </p>
          </section>
          <section>
            <h2>기술의 자리를 다시 설계합니다</h2>
            <p>
              스마트폰에 집중된 기능을 사물과 공간으로 나누고, Calm Technology와
              물리적 인터페이스를 통해 필요한 기능이 필요한 순간에만 앞으로
              나오게 합니다. 기술이 계속 주의를 요구하는 대신 사람이 무엇에
              집중할지 선택할 수 있어야 합니다.
            </p>
          </section>
          <section>
            <h2>삶의 선택지를 다시 늘립니다</h2>
            <p>
              화면을 덜 본 시간을 하나의 숫자로 끝내지 않습니다. 그 자리에
              활동·관계·공간·창작과 직접 부딪히는 경험이 돌아오도록 돕습니다.
              편리함을 포기하는 일이 아니라, 편리함 때문에 사라진 선택권을 다시
              만드는 일입니다.
            </p>
          </section>
          <p className="brand-line">
            NEICA: for the immeasurable world
            <span>측정할 수 없는 세계를 위해.</span>
          </p>
        </div>
      </main>
    );
  if (page === "community")
    return (
      <main className="text-page" id="main">
        <span className="page-label">COMMUNITY</span>
        <h1>
          화면 밖에서
          <br />
          함께하는 시간.
        </h1>
        <div className="prose">
          <p className="lead">
            활동과 관계, 새로운 경험을 통해 일상의 선택지를 넓힙니다.
          </p>
          <p>
            기술을 사용하는 방식을 함께 생각하고, 각자의 일상에서 시도한 변화를
            나눌 수 있는 자리를 준비합니다.
          </p>
          <p className="muted">참여 소식은 이곳에서 안내하겠습니다.</p>
        </div>
      </main>
    );
  if (page === "contact")
    return (
      <main className="text-page contact-page" id="main">
        <span className="page-label">CONTACT</span>
        <h1>
          연결되는
          <br />
          곳.
        </h1>
        <div className="contact-list" aria-label="NEICA labs 연락처">
          <a className="contact-link" href="mailto:neica.labs@gmail.com">
            <span className="contact-copy">
              <span className="contact-meta">이메일주소</span>
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
              <span className="contact-meta">인스타주소</span>
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
        페이지를
        <br />
        찾을 수 없습니다.
      </h1>
      <a href={siteUrl()}>LABS로 돌아가기 ↗</a>
    </main>
  );
}
const page = document.body.dataset.page || "home";
createRoot(document.getElementById("root")!).render(
  <>
    <a className="skip-link" href="#main">
      본문으로 이동
    </a>
    <SiteHeader page={page} />
    {page === "labs" || page === "home" ? <Labs /> : <Page page={page} />}
    <footer className="site-footer">
      <span>NEICA</span>
      <span>for the immeasurable world</span>
      {catalog.mode === "review" && (
        <span
          className="review-label"
          title="로컬 검수용입니다. 공개 사이트에 반영되지 않습니다."
        >
          검수 미리보기
        </span>
      )}
    </footer>
  </>,
);
