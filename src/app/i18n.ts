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
      emphasis: ["인간다운 삶", "스스로 고민하고", "그 선택에 책임지는", "자기만의 기준", "사람이 직접 판단하고 경험할 자리", "주의·시간·행동을 스스로 선택", "연구 공간", "생각의 재료를 나눕니다", "같은 방향을 추구하는 사람들의 모임", "일상에서 실천"] as const,
      lead: "NEICA는 숫자와 효율만으로 설명되지 않는 인간다운 삶을 지키는 프로젝트입니다.",
      humanHeading: "우리가 생각하는 인간",
      humanBody: "인간은 스스로 고민하고, 무엇을 소중히 여길지 선택하며, 그 선택에 책임지는 존재입니다. 몸으로 부딪히고 시행착오를 겪으며 자기만의 기준을 만듭니다. 오래 몰두하는 즐거움, 관계를 쌓는 시간, 무언가를 지키려는 고집은 삶을 이루는 가치입니다.",
      focusHeading: "NEICA가 집중하는 것",
      focusBody: "기술이 더 많은 일을 대신할수록, 사람이 직접 판단하고 경험할 자리를 지키는 데 집중합니다. 자신의 주의·시간·행동을 스스로 선택하고, 몸으로 만들고 배우며 타인과 관계 맺을 수 있도록 기술과 일상의 환경을 다시 설계합니다. ‘측정할 수 없는 세계를 위해’는 우리가 지키려는 삶의 방향입니다.",
      nameBody: "NEICA는 noise, error, inefficient, constraint, ambiguous의 첫 글자에서 시작된 이름입니다. 최적화의 과정에서 지워지기 쉬운 인간의 삶을 기억합니다.",
      intro:
        "For the immeasurable world. 우리가 하는 연구와 실천은 이 문장에서 시작합니다.",
      principles: [
        { heading: "지키고 싶은 가치에 기준을 둡니다", body: "더 빠르고, 더 크고, 더 많은 것이 언제나 더 좋은 것은 아닙니다. 오래 고민하고 정성을 들이는 과정, 관계를 쌓는 시간, 자신만의 기준으로 완성한 일에는 가격과 성과로 환산되지 않는 가치가 있습니다. 우리는 그 가치를 지키는 고집을 존중합니다." },
        { heading: "고민하고 결정하는 주체로 남습니다", body: "답을 쉽게 얻을 수 있어도, 무엇을 중요하게 여길지는 스스로 판단해야 합니다. 고민하고 선택하며 그 결과를 책임지는 과정은 자기 삶을 만드는 일입니다. 우리는 기술의 도움 속에서도 이 역할을 놓지 않습니다." },
        { heading: "기술의 자리를 사람이 정합니다", body: "사람이 자신의 주의·시간·행동을 선택할 수 있어야 합니다. 기술은 그 선택을 돕고, 직접 경험하고 만들며 타인과 관계 맺을 여지를 남겨야 합니다. 우리는 이 원칙을 바탕으로 사람과 기술의 관계를 다시 생각합니다." },
      ],
      wordsHeading: "NEICA가 기억하는 다섯 단어",
      wordMeanings: ["소음", "오류", "비효율적인 것", "제약", "모호함"],
      wordsBody:
        "다섯 단어의 첫 글자에서 시작된 이름입니다.",
      technologyHeading: "NEICA labs",
      technologyBody:
        "이 방향을 탐구하는 연구 공간입니다. 사람과 기술의 관계를 살피는 자료와 관점, 사례를 공유합니다. 우리가 어떤 삶을 원하는지 스스로 판단할 수 있도록 생각의 재료를 나눕니다.",
      choiceHeading: "NEICA community",
      choiceBody:
        "같은 방향을 추구하는 사람들의 모임입니다. 각자의 경험과 시도를 나누고, 함께 활동하며 그 생각을 일상에서 실천합니다. 서로의 삶을 통해 새로운 선택지를 발견합니다.",
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
      emphasis: ["what makes life human", "thinking for ourselves", "taking responsibility", "our own standards", "human judgment and direct experience", "choose how to direct their attention, time, and actions", "research space", "material to think with", "people who share this direction", "everyday practice"] as const,
      lead: "NEICA protects what makes life human, beyond numbers and efficiency.",
      humanHeading: "How we understand being human",
      humanBody: "Being human means thinking for ourselves, choosing what matters, and taking responsibility for those choices. Through hands-on experience and trial and error, we develop our own standards. The joy of deep engagement, time spent building relationships, and the resolve to protect what matters all give life value.",
      focusHeading: "What NEICA focuses on",
      focusBody: "As technology takes on more of our tasks, we focus on preserving room for human judgment and direct experience. We redesign technology and everyday environments so people can choose how to direct their attention, time, and actions—and have room to make, learn, and connect with others. ‘For the immeasurable world’ expresses the kind of life we seek to protect.",
      nameBody: "NEICA takes its name from noise, error, inefficient, constraint, and ambiguous. It reminds us of the human dimensions of life that optimization can erase.",
      intro:
        "For the immeasurable world. Our research and practice begin with these words.",
      principles: [
        { heading: "Hold to what matters", body: "Faster, bigger, and more are not always better. Careful thought, time spent building relationships, and work shaped by personal standards have value beyond price and performance. We respect the resolve to protect that value." },
        { heading: "Keep thinking and choosing for ourselves", body: "Even when answers come easily, we must decide what matters. Thinking, choosing, and taking responsibility for the consequences are how we shape our own lives. We hold on to that role while accepting the help technology offers." },
        { heading: "Let people decide where technology belongs", body: "People should be able to choose how they direct their attention, time, and actions. Technology should support those choices and leave room for direct experience, making, and relationships. This principle guides how we rethink the relationship between people and technology." },
      ],
      wordsHeading: "Five words NEICA remembers",
      wordMeanings: [
        "what resists a clean signal",
        "what reveals a model's limit",
        "time not optimized away",
        "a boundary that shapes choice",
        "room for interpretation",
      ],
      wordsBody:
        "NEICA takes its name from the first letters of these five words.",
      technologyHeading: "NEICA labs",
      technologyBody:
        "A research space that explores this direction. We share research, perspectives, and examples concerning the relationship between people and technology, giving people material to think with as they decide what kind of life they want.",
      choiceHeading: "NEICA community",
      choiceBody:
        "A gathering of people who share this direction. We exchange experiences, try things together, and put our ideas into everyday practice. Through one another’s lives, we discover new possibilities for our own.",
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
