import { createRoot } from "react-dom/client";
import catalog from "virtual:neica-catalog";
import SiteHeader from "./app/SiteHeader";
import { officialLinks } from "./app/siteConfig";
import ContentCard from "./content/ContentCard";
import CarouselViewer from "./viewer/CarouselViewer";
import useViewerUrl from "./viewer/useViewerUrl";
import { destination, siteUrl } from "./lib/urls";
import "./styles.css";

function Home() {
  const viewer = useViewerUrl();
  return (
    <>
      <main id="main" className="home-content">
        <h1 className="sr-only">NEICA 콘텐츠</h1>
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
            NEICA는 사람이 자신의 주의·시간·행동을 다시 선택할 수 있도록 기술과
            환경을 설계합니다.
          </p>
          <p>
            스마트폰은 많은 일을 편리하게 만들었습니다. 동시에 우리의 시간과
            주의를 하나의 화면 안으로 모았습니다. NEICA는 스마트폰에 집중된
            기능을 물리적 세계와 일상 속으로 분산하고, 사람이 기술을 의식적으로
            사용할 수 있는 환경을 만듭니다.
          </p>
          <section>
            <h2>기술의 재설계</h2>
            <p>
              NFC, 웨어러블, 전용 디바이스, Calm Technology를 통해 기술이 계속
              주의를 요구하지 않도록 합니다. 필요한 기능이 필요한 순간과 장소에
              머물도록 설계합니다.
            </p>
          </section>
          <section>
            <h2>삶의 선택지를 늘리는 일</h2>
            <p>
              화면 사용시간을 줄인 자리에서 할 수 있는 활동·관계·공간·경험을
              다시 발견합니다. 효율과 수치만으로 설명할 수 없는 삶의 영역에
              주의를 기울입니다.
            </p>
          </section>
          <p className="brand-line">NEICA: for the immeasurable world</p>
        </div>
      </main>
    );
  if (page === "labs")
    return (
      <main className="text-page" id="main">
        <span className="page-label">LABS</span>
        <h1>
          기술의 자리를
          <br />
          다시 생각합니다.
        </h1>
        <div className="prose">
          <p className="lead">
            손에 닿는 도구, 생활 속의 작은 경계, 함께 만드는 습관을 연구합니다.
          </p>
          <p>
            스마트폰에 모인 기능을 사물과 공간으로 나누고, 행동을 바꿀 수 있는
            환경을 실험합니다.
          </p>
          <p className="muted">공개할 프로젝트를 준비하고 있습니다.</p>
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
  if (page === "link")
    return (
      <main className="text-page" id="main">
        <span className="page-label">LINK</span>
        <h1>
          NEICA와
          <br />
          연결되는 곳.
        </h1>
        {officialLinks.length ? (
          <ul className="official-links">
            {officialLinks.map((link) => (
              <li key={link.href}>
                <a
                  href={destination(link.href)}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {link.label}
                  <span>↗</span>
                </a>
              </li>
            ))}
          </ul>
        ) : (
          <p className="muted">공식 채널을 준비하고 있습니다.</p>
        )}
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
      <a href={siteUrl()}>HOME으로 돌아가기 ↗</a>
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
    {page === "home" ? <Home /> : <Page page={page} />}
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
