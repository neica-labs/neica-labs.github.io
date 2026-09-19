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
    submit: {
      label: "투고",
      cardTitle: "당신의 고민을\n투고해 주세요.",
      cardBody: "누구나 보낼 수 있습니다. 아직 답이 없는 질문도 좋습니다.",
      cardAction: "투고하기",
      heading: "다음 이야기는 당신의 질문에서 시작됩니다.",
      lead: "누구나 투고할 수 있습니다. 기술과 삶의 관계에서 직접 겪은 일, 오래 붙잡고 있는 질문, 함께 생각해 보고 싶은 이야기를 보내주세요.",
      body: "완성된 글이 아니어도 좋습니다. 무엇이 마음에 남았는지, 왜 그 문제를 고민하게 되었는지를 편한 길이로 적어주세요.",
      process: "더 이야기하고 싶은 투고에는 인터뷰를 제안할 수 있습니다. 글이나 인터뷰를 게시할 때는 내용과 이름 표기 방식을 먼저 함께 확인합니다.",
      emailAction: "이메일로 투고하기",
      emailSubject: "[NEICA 투고] 함께 생각하고 싶은 이야기",
      emailBody: "안녕하세요.\n\n함께 생각하고 싶은 질문이나 경험:\n\n이 이야기를 보내는 이유:\n\n연락받을 이름 또는 호칭:\n",
    },
    about: {
      heading: "측정할 수 없는\n세계를 위해.",
      emphasis: ["인간다운 삶", "스스로 고민하고", "그 선택에 책임지는", "자기만의 기준", "사람이 직접 판단하고 경험할 자리", "주의·시간·행동을 스스로 선택", "연구 공간", "생각의 재료를 나눕니다", "같은 방향을 추구하는 사람들의 모임", "일상에서 실천"] as const,
      lead: "NEICA는 숫자와 효율만으로 설명되지 않는 인간다운 삶을 지키는 프로젝트입니다.",
      humanHeading: "우리가 생각하는 인간",
      humanBody: "인간은 스스로 고민하고, 무엇을 소중히 여길지 선택하며, 그 선택에 책임지는 존재입니다. 몸으로 부딪히고 시행착오를 겪으며 자기만의 기준을 만듭니다. 오래 몰두하는 즐거움, 관계를 쌓는 시간, 무언가를 지키려는 고집은 삶을 이루는 가치입니다.",
      focusHeading: "NEICA가 집중하는 것",
      focusBody: "기술이 더 많은 일을 대신할수록, 사람이 직접 판단하고 경험할 자리를 지키는 데 집중합니다. 자신의 주의·시간·행동을 스스로 선택하고, 몸으로 만들고 배우며 타인과 관계 맺을 수 있도록 기술과 일상의 환경을 다시 설계합니다. ‘측정할 수 없는 세계를 위해’는 우리가 지키려는 삶의 방향입니다.",
      nameBody: "NEICA는 noise, error, inefficiency, constraint, ambiguity의 첫 글자에서 시작된 이름입니다. 최적화의 과정에서 지워지기 쉬운 인간의 삶을 기억합니다.",
      intro:
        "For the immeasurable world. 우리가 하는 연구와 실천은 이 문장에서 시작합니다.",
      principles: [
        { heading: "지키고 싶은 가치에 기준을 둡니다", body: "더 빠르고, 더 크고, 더 많은 것이 언제나 더 좋은 것은 아닙니다. 오래 고민하고 정성을 들이는 과정, 관계를 쌓는 시간, 자신만의 기준으로 완성한 일에는 가격과 성과로 환산되지 않는 가치가 있습니다. 우리는 그 가치를 지키는 고집을 존중합니다." },
        { heading: "고민하고 결정하는 주체로 남습니다", body: "답을 쉽게 얻을 수 있어도, 무엇을 중요하게 여길지는 스스로 판단해야 합니다. 고민하고 선택하며 그 결과를 책임지는 과정은 자기 삶을 만드는 일입니다. 우리는 기술의 도움 속에서도 이 역할을 놓지 않습니다." },
        { heading: "기술의 자리를 사람이 정합니다", body: "사람이 자신의 주의·시간·행동을 선택할 수 있어야 합니다. 기술은 그 선택을 돕고, 직접 경험하고 만들며 타인과 관계 맺을 여지를 남겨야 합니다. 우리는 이 원칙을 바탕으로 사람과 기술의 관계를 다시 생각합니다." },
      ],
      wordsHeading: "NEICA가 기억하는 다섯 단어",
      wordMeanings: ["잡음", "오류", "비효율", "제약", "모호함"],
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
      heading: "무엇을 지킬지,\n함께 묻습니다.",
      lead: "기술이 더 많은 일을 대신할수록, 무엇을 소중히 여길지는 사람이 직접 결정해야 합니다.",
      body: "혼자만의 결심에 맡기지 않고 서로의 경험을 듣고, 일상에서 시도한 변화를 나누기 위해 모입니다. NEICA community는 함께 질문하고 실험할 자리를 준비하고 있습니다.",
      earlyHeading: "뉴스레터 사전 등록",
      earlyBody: "NEICA의 글과 모임 소식을 전합니다. 시작 전에 이메일을 남겨주세요.",
      emailLabel: "이메일",
      emailPlaceholder: "you@example.com",
      consent: "뉴스레터 시작 안내와 NEICA의 글·모임 소식 이메일 수신에 동의합니다.",
      submit: "등록하기",
      submitting: "등록 중…",
      success: "신청을 받았습니다. 이메일로 보낸 접수 안내를 확인해 주세요.",
      error: "접수 안내 메일을 보내지 못했습니다. 잠시 후 같은 주소로 다시 시도해 주세요.",
      unavailable: "사전 등록 접수 준비 중입니다.",
      privacyLink: "개인정보 처리 안내",
    },
    privacy: {
      heading: "개인정보 처리 안내",
      intro: "NEICA labs는 COMMUNITY 뉴스레터 사전 등록에 필요한 정보만 수집합니다.",
      sections: [
        { heading: "수집 항목과 목적", body: "이메일 주소, 선택한 언어, 동의 문구의 버전과 동의 시점을 저장합니다. 뉴스레터 시작 안내와 NEICA의 글·모임 소식을 전하는 데 사용합니다." },
        { heading: "보관과 삭제", body: "구독 취소나 삭제 요청 시까지 보관합니다. 이메일 주소의 실제 소유 여부를 별도로 확인하지는 않습니다. 삭제를 요청하면 해당 등록 정보를 제거합니다." },
        { heading: "외부 서비스 이용", body: "접수와 보관에는 Cloudflare, Inc.(미국)의 Worker와 D1 데이터베이스를 이용합니다. 접수 안내 메일은 Google LLC(미국)의 Apps Script와 Gmail을 통해 발송하며, 이때 이메일 주소가 Google에 전달됩니다. D1의 주 저장 위치는 아시아·태평양 지역으로 설정되어 있습니다." },
        { heading: "문의와 권리 행사", body: "열람·정정·삭제 또는 처리 중지를 원하면 neica.labs@gmail.com으로 연락해 주세요. 운영자: NEICA labs." },
      ],
      effective: "시행일 2026.09.19",
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
    submit: {
      label: "CONTRIBUTE",
      cardTitle: "Share the question\nyou carry.",
      cardBody: "Open to everyone. Unfinished thoughts are welcome.",
      cardAction: "Contribute",
      heading: "The next story begins with your question.",
      lead: "Anyone can contribute. Tell us about an experience, a question you keep returning to, or something you want to explore about technology and human life.",
      body: "Your thought does not need to be a finished essay. Write as much or as little as you need about what stayed with you and why it matters.",
      process: "We may invite contributors to a conversation. Before sharing a story or interview, we will check the text and how you would like to be credited.",
      emailAction: "Contribute by email",
      emailSubject: "[NEICA contribution] A question to explore",
      emailBody: "Hello,\n\nA question or experience I would like to share:\n\nWhy this matters to me:\n\nName or preferred form of address:\n",
    },
    about: {
      heading: "For the\nimmeasurable world.",
      emphasis: ["what makes life human", "thinking for ourselves", "taking responsibility", "our own standards", "human judgment and direct experience", "choose how to direct their attention, time, and actions", "research space", "material to think with", "people who share this direction", "everyday practice"] as const,
      lead: "NEICA protects what makes life human, beyond numbers and efficiency.",
      humanHeading: "How we understand being human",
      humanBody: "Being human means thinking for ourselves, choosing what matters, and taking responsibility for those choices. Through hands-on experience and trial and error, we develop our own standards. The joy of deep engagement, time spent building relationships, and the resolve to protect what matters all give life value.",
      focusHeading: "What NEICA focuses on",
      focusBody: "As technology takes on more of our tasks, we focus on preserving room for human judgment and direct experience. We redesign technology and everyday environments so people can choose how to direct their attention, time, and actions—and have room to make, learn, and connect with others. ‘For the immeasurable world’ expresses the kind of life we seek to protect.",
      nameBody: "NEICA takes its name from noise, error, inefficiency, constraint, and ambiguity. It reminds us of the human dimensions of life that optimization can erase.",
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
      heading: "Deciding what matters,\ntogether.",
      lead: "As technology takes on more of our tasks, deciding what matters must remain our own responsibility.",
      body: "We gather to hear one another's experiences and share changes we have tried in everyday life, rather than leaving it all to individual resolve. NEICA community is preparing a place to ask questions and experiment together.",
      earlyHeading: "Newsletter early access",
      earlyBody: "Get NEICA's writing and gathering updates. Leave your email before we begin.",
      emailLabel: "Email",
      emailPlaceholder: "you@example.com",
      consent: "I agree to receive the launch notice, NEICA writing, and gathering updates by email.",
      submit: "Sign up",
      submitting: "Registering…",
      success: "We received your request. Please check the receipt email we sent you.",
      error: "We couldn't send the receipt email. Please try again with the same address shortly.",
      unavailable: "Early registration is being prepared.",
      privacyLink: "Privacy notice",
    },
    privacy: {
      heading: "Privacy notice",
      intro: "NEICA labs collects only the information needed for COMMUNITY newsletter early registration.",
      sections: [
        { heading: "What we collect and why", body: "We store your email address, selected language, and the version and time of your consent. We use them to announce the newsletter launch and send NEICA writing and gathering updates." },
        { heading: "Retention and deletion", body: "We retain your details until you unsubscribe or request deletion. We do not separately verify ownership of the email address. On request, we remove the registration record." },
        { heading: "External service", body: "We use Cloudflare, Inc. (United States) Workers and D1 to receive and store registrations. We send the receipt email through Google LLC (United States) Apps Script and Gmail, which receives your email address for delivery. The D1 primary is set to the Asia-Pacific region." },
        { heading: "Your choices and contact", body: "To access, correct, delete, or stop processing your details, write to neica.labs@gmail.com. Operator: NEICA labs." },
      ],
      effective: "Effective 19 September 2026",
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
        "Noise, Error, Inefficiency, Constraint, Ambiguity. 측정할 수 없는 인간의 선택을 위해 기술의 자리를 다시 설계합니다.",
    },
    community: {
      title: "COMMUNITY — NEICA",
      description: "활동과 관계, 함께하는 경험을 통해 삶의 선택지를 넓힙니다.",
    },
    contact: {
      title: "CONTACT — NEICA",
      description: "NEICA labs의 이메일과 인스타그램입니다.",
    },
    privacy: {
      title: "개인정보 처리 안내 — NEICA",
      description: "NEICA community 뉴스레터 사전 등록 개인정보 처리 안내입니다.",
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
        "Noise, Error, Inefficiency, Constraint, Ambiguity. Redesigning technology for the immeasurable parts of human life.",
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
    privacy: {
      title: "Privacy notice — NEICA",
      description: "How NEICA handles newsletter early-registration details.",
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
