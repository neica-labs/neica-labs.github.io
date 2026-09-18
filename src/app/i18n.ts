import type { Locale } from "../types";

export const copy = {
  ko: {
    language: "언어",
    skip: "본문으로 이동",
    mainLabel: "주 메뉴",
    homeLabel: "NEICA 홈",
    labs: {
      srTitle: "NEICA LABS 콘텐츠",
      empty: "첫 번째 이야기를 준비하고 있습니다.",
      about: "NEICA 알아보기 ↗",
      heading: "기술의 자리를\n다시 생각합니다.",
      lead: "손에 닿는 도구, 생활 속의 작은 경계, 함께 만드는 습관을 연구합니다.",
      body: "스마트폰에 모인 기능을 사물과 공간으로 나누고, 행동을 바꿀 수 있는 환경을 실험합니다.",
    },
    about: {
      heading: "측정할 수 없는\n세계를 위해.",
      lead: "NEICA labs는 효율과 최적화만으로 설명되지 않는 인간의 선택을 지키며, 기술이 삶에서 차지하는 자리를 다시 설계합니다.",
      intro:
        "기술을 덜 쓰는 것 자체가 목적은 아닙니다. 기술이 사람의 주의·시간·행동을 대신 결정하지 않도록, 필요한 기능은 가까이 두고 불필요한 요구는 주변으로 물러나게 하는 도구와 환경을 연구합니다.",
      wordsHeading: "NEICA가 기억하는 다섯 단어",
      wordMeanings: ["소음", "오류", "비효율적인 것", "제약", "모호함"],
      wordsBody:
        "최적화의 언어에서는 제거해야 할 값처럼 보이지만, 인간의 삶에서는 탐색·학습·숙련·책임·해석이 시작되는 조건이기도 합니다. NEICA는 이 다섯 단어를 기술이 함부로 지워서는 안 될 인간적 영역을 기억하는 이름으로 사용합니다.",
      technologyHeading: "기술의 자리를 다시 설계합니다",
      technologyBody:
        "스마트폰에 집중된 기능을 사물과 공간으로 나누고, Calm Technology와 물리적 인터페이스를 통해 필요한 기능이 필요한 순간에만 앞으로 나오게 합니다. 기술이 계속 주의를 요구하는 대신 사람이 무엇에 집중할지 선택할 수 있어야 합니다.",
      choiceHeading: "삶의 선택지를 다시 늘립니다",
      choiceBody:
        "화면을 덜 본 시간을 하나의 숫자로 끝내지 않습니다. 그 자리에 활동·관계·공간·창작과 직접 부딪히는 경험이 돌아오도록 돕습니다. 편리함을 포기하는 일이 아니라, 편리함 때문에 사라진 선택권을 다시 만드는 일입니다.",
      translation: "측정할 수 없는 세계를 위해.",
    },
    community: {
      heading: "화면 밖에서\n함께하는 시간.",
      lead: "활동과 관계, 새로운 경험을 통해 일상의 선택지를 넓힙니다.",
      body: "기술을 사용하는 방식을 함께 생각하고, 각자의 일상에서 시도한 변화를 나눌 수 있는 자리를 준비합니다.",
      note: "참여 소식은 이곳에서 안내하겠습니다.",
    },
    contact: {
      heading: "연결되는\n곳.",
      listLabel: "NEICA labs 연락처",
      email: "이메일주소",
      instagram: "인스타주소",
    },
    notFound: {
      heading: "페이지를\n찾을 수 없습니다.",
      back: "LABS로 돌아가기 ↗",
    },
    card: {
      slides: (count: number) => `${count}장 슬라이드 열기`,
      external: "새 탭에서 열기",
      internal: "페이지로 이동",
      imageError: "이미지를 불러오지 못했습니다",
    },
    viewer: {
      untitled: "콘텐츠를 찾을 수 없습니다",
      close: "닫기",
      missing: "콘텐츠를 찾을 수 없습니다.",
      back: "LABS로 돌아가기",
      loadError: "콘텐츠를 불러오지 못했습니다.",
      retry: "다시 시도",
      loading: "콘텐츠 불러오는 중",
      previous: "이전 슬라이드",
      next: "다음 슬라이드",
      zoomOut: "축소",
      fit: "화면에 맞춤",
      zoomIn: "확대",
      reset: "화면 맞춤 복귀",
      info: "캡션과 출처",
      currentSlide: "현재 슬라이드 내용",
      credits: "크레딧",
      sources: "출처 링크",
    },
    review: "검수 미리보기",
  },
  en: {
    language: "Language",
    skip: "Skip to content",
    mainLabel: "Main navigation",
    homeLabel: "NEICA home",
    labs: {
      srTitle: "NEICA LABS stories",
      empty: "The first story is being prepared.",
      about: "About NEICA ↗",
      heading: "Rethinking where\ntechnology belongs.",
      lead: "We study tangible tools, small boundaries in daily life, and habits built together.",
      body: "We distribute functions concentrated in the smartphone across objects and spaces, then test environments that can support different behavior.",
    },
    about: {
      heading: "For the\nimmeasurable world.",
      lead: "NEICA labs protects human choices that cannot be explained by efficiency and optimization alone, redesigning the place technology occupies in life.",
      intro:
        "Using less technology is not the goal in itself. We study tools and environments that keep necessary functions close while moving needless demands to the periphery, so technology does not decide our attention, time, and actions on our behalf.",
      wordsHeading: "Five words NEICA remembers",
      wordMeanings: [
        "what resists a clean signal",
        "what reveals a model's limit",
        "time not optimized away",
        "a boundary that shapes choice",
        "room for interpretation",
      ],
      wordsBody:
        "The language of optimization treats these as values to remove. In human life, however, they are also conditions from which exploration, learning, skill, responsibility, and interpretation begin. NEICA uses these five words to remember the human territory technology should not erase without question.",
      technologyHeading: "Redesigning the place of technology",
      technologyBody:
        "We distribute functions concentrated in the smartphone across objects and spaces. Through Calm Technology and physical interfaces, useful functions move forward only when they are needed. Technology should not continually demand attention; people should remain able to choose what deserves their focus.",
      choiceHeading: "Restoring more ways to live",
      choiceBody:
        "Time away from a screen should not end as another metric. We work to return activity, relationships, places, making, and direct experience to that space. This is not a rejection of convenience, but the recovery of choices that convenience has quietly removed.",
      translation: "For the immeasurable world.",
    },
    community: {
      heading: "Time together,\nbeyond the screen.",
      lead: "Activities, relationships, and new experiences can widen the choices available in everyday life.",
      body: "We are preparing places to think together about how technology is used and to share changes tested in our own lives.",
      note: "Participation updates will be posted here.",
    },
    contact: {
      heading: "Ways to\nconnect.",
      listLabel: "Contact NEICA labs",
      email: "Email",
      instagram: "Instagram",
    },
    notFound: {
      heading: "This page\ncould not be found.",
      back: "Return to LABS ↗",
    },
    card: {
      slides: (count: number) => `Open ${count}-slide carousel`,
      external: "Open in a new tab",
      internal: "Open page",
      imageError: "The image could not be loaded",
    },
    viewer: {
      untitled: "Content not found",
      close: "Close",
      missing: "Content not found.",
      back: "Return to LABS",
      loadError: "The content could not be loaded.",
      retry: "Try again",
      loading: "Loading content",
      previous: "Previous slide",
      next: "Next slide",
      zoomOut: "Zoom out",
      fit: "Fit to screen",
      zoomIn: "Zoom in",
      reset: "Reset view",
      info: "Caption and sources",
      currentSlide: "Current slide text",
      credits: "Credits",
      sources: "Source links",
    },
    review: "Review preview",
  },
} as const;

export function readLocale(): Locale {
  return new URLSearchParams(window.location.search).get("lang") === "en"
    ? "en"
    : "ko";
}

const metadata: Record<
  Locale,
  Record<string, { title: string; description: string }>
> = {
  ko: {
    labs: {
      title: "NEICA — for the immeasurable world",
      description:
        "기술과 인간의 관계를 다시 설계합니다. NEICA의 콘텐츠와 프로젝트를 만나보세요.",
    },
    about: {
      title: "ABOUT — NEICA",
      description:
        "Noise, Error, Inefficient, Constraint, Ambiguous. 측정할 수 없는 인간의 선택을 위해 기술의 자리를 다시 설계합니다.",
    },
    community: {
      title: "COMMUNITY — NEICA",
      description: "활동과 관계, 함께하는 경험을 통해 삶의 선택지를 넓힙니다.",
    },
    contact: {
      title: "CONTACT — NEICA",
      description: "NEICA labs의 이메일과 인스타그램입니다.",
    },
  },
  en: {
    labs: {
      title: "NEICA — for the immeasurable world",
      description:
        "NEICA redesigns the relationship between technology and human life.",
    },
    about: {
      title: "ABOUT — NEICA",
      description:
        "Noise, Error, Inefficient, Constraint, Ambiguous. Redesigning technology for the immeasurable parts of human life.",
    },
    community: {
      title: "COMMUNITY — NEICA",
      description:
        "Widening everyday choices through activity, relationships, and shared experience.",
    },
    contact: {
      title: "CONTACT — NEICA",
      description: "Email and Instagram links for NEICA labs.",
    },
  },
};

export function applyDocumentLocale(page: string, locale: Locale) {
  document.documentElement.lang = locale;
  const key = page === "home" ? "labs" : page;
  const value = metadata[locale][key] ?? {
    title: "NEICA",
    description: metadata[locale].labs.description,
  };
  document.title = value.title;
  for (const selector of [
    'meta[name="description"]',
    'meta[property="og:description"]',
  ])
    document
      .querySelector(selector)
      ?.setAttribute("content", value.description);
  document
    .querySelector('meta[property="og:title"]')
    ?.setAttribute("content", value.title);
}
