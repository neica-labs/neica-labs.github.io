import { createRoot } from "react-dom/client";
import SiteHeader from "./app/SiteHeader";
import { readLocale } from "./app/i18n";
import { localizedSiteUrl } from "./lib/urls";
import { testerGroupUrl, groupConnectionPending, testJoinUrl, testInstallUrl, testSupportEmail } from "./ritmus-test-config";
import "./styles.css";
import "./ritmus-test.css";

const en = readLocale() === "en";
const t = (ko: string, english: string) => en ? english : ko;
const feedback = "mailto:" + testSupportEmail + "?subject=" + encodeURIComponent("[RITMUS] Android 테스트 피드백");
const steps = [
  { title: t("그룹 가입", "Join the group"),
    body: t("Google 그룹에서 ‘그룹 가입’을 눌러 주세요. 운영자 승인 없이 가입할 수 있어요.", "Select ‘Join group’ on Google Groups. No approval from us is needed."),
    action: t("그룹 가입하기", "Join group"), url: testerGroupUrl },
  { title: t("테스트 참여", "Join the test"),
    body: t("Google Play에서 ‘테스터 되기’를 눌러 주세요. 이미 참여했다면 바로 3번으로 이동하세요.", "Select ‘Become a tester’ on Google Play. Already enrolled? Go straight to step 3."),
    action: t("테스트 참여하기", "Join test"), url: testJoinUrl },
  { title: t("앱 설치", "Install RITMUS"),
    body: t("안드로이드 휴대폰의 Play 스토어에서 설치하세요. 별도의 설치 완료 보고는 필요 없어요.", "Install from the Play Store on your Android phone. No completion form is needed."),
    action: t("앱 설치하기", "Install app"), url: testInstallUrl },
];

function App() {
  return <>
    <a className="skip-link" href="#main">{t("본문으로 이동", "Skip to content")}</a>
    <SiteHeader page="ritmus-test" locale={en ? "en" : "ko"} />
    <main id="main" className="test-page">
      <div className="test-path"><a href={localizedSiteUrl("", en ? "en" : "ko")}>NEICA LABS</a><span aria-hidden="true">/</span><span>ANDROID TEST</span></div>
      <header className="test-intro">
        <span className="test-eyebrow">RITMUS</span>
        <h1>{t("참여하고, 바로 써보세요.", "Join in. Try RITMUS.")}</h1>
        <p>{t("습관과 스마트폰 시간을 함께 관리하는 RITMUS. 아래 순서대로 진행하면 됩니다.", "Habits and phone time, together in RITMUS. Follow the steps below to get started.")}</p>
        <span className="test-edition">{t("안드로이드 휴대폰 · 한국 Google Play 계정", "Android phone · South Korean Google Play account")}</span>
      </header>
      <div className="test-account-note"><strong>[{t("같은 계정으로 진행해 주세요", "USE THE SAME ACCOUNT")}]</strong><span>{t("그룹·테스트 참여·Play 스토어 모두 같은 Google 계정을 사용하세요.", "Use the same Google account for the group, the test, and the Play Store.")}</span></div>
      {!testerGroupUrl && <p className="test-pending" role="status">{t("그룹 연결을 준비하고 있습니다. 연결 후 이 페이지에서 바로 참여할 수 있어요.", "The tester group is being connected. Please return once setup is complete.")}</p>}
      {testerGroupUrl && groupConnectionPending && <p className="test-pending" role="status"><strong>[{t("Google Play 연결 반영 중", "GOOGLE PLAY UPDATE PENDING")}]</strong><br />{t("그룹에는 지금 가입할 수 있어요. 테스트 참여·설치는 Google의 그룹 연결 변경 반영 후 가능합니다. 아직 접근이 안 되면 나중에 다시 확인해 주세요.", "You can join the group now. Test enrollment and installation become available once Google publishes the group-access update. If access is unavailable, please check back later.")}</p>}
      <section className="test-steps" aria-label={t("참여 순서", "How to join")}>
        {steps.map((step, index) => <article className="test-step" key={index}>
          <span className="test-number" aria-hidden="true">0{index + 1}</span>
          <div className="test-step-copy"><h2>{step.title}</h2><p>{step.body}</p></div>
          {step.url && testerGroupUrl ? <a className={"test-action" + (index === 0 ? " primary" : "")} href={step.url} target="_blank" rel="noopener noreferrer">{step.action}<span aria-hidden="true">↗</span><span className="sr-only">{t(" (새 탭)", " (new tab)")}</span></a> : <button className="test-action" disabled>{t("연결 준비 중", "Setup in progress")}</button>}
        </article>)}
      </section>
      <p className="test-join-note">{t("그룹 가입 후 이 페이지로 돌아와 2번을 눌러 주세요. 이메일 요청이나 회신 대기는 없습니다.", "After joining the group, return here for step 2. No email request or reply is needed.")}</p>
      <div className="test-followup"><p><strong>[{t("14일 동안 함께해 주세요", "STAY FOR 14 DAYS")}]</strong><br />{t("테스트 참여를 최소 14일 연속 유지하면서 앱을 사용해 주세요.", "Stay enrolled for at least 14 consecutive days and try the app in everyday life.")}</p><a href={feedback} className="test-feedback">{t("의견 보내기 (선택)", "Send feedback (optional)")} ↗</a></div>
      <details className="test-help"><summary>{t("설치가 안 되거나, 궁금한 점이 있나요?", "Trouble installing or have a question?")}</summary>
        <div className="test-faq">
          <section><h2>{t("‘App not available’ / ‘항목을 찾을 수 없습니다’", "‘App not available’ / ‘Item not found’")}</h2><p>{t("Chrome과 Play 스토어의 계정이 같은지 확인하세요. 그룹 가입 후 2번에서 ‘테스터 되기’까지 눌러야 합니다. 가입 직후에는 반영에 시간이 걸릴 수 있어요. 현재 테스트는 한국에서 제공됩니다.", "Check that Chrome and the Play Store use the same account. Join the group, then select ‘Become a tester’ in step 2. Recent changes may take time to appear. This test is available in South Korea.")}</p></section>
          <section><h2>{t("카카오톡에서 열었거나 로그인 화면이 반복돼요", "Opened inside a messaging app or stuck signing in?")}</h2><p>{t("페이지 주소를 복사해 Chrome에서 열어 주세요. 이미 Google에 로그인돼 있으면 기존 계정으로 진행할 수 있지만, 계정 선택이나 재로그인이 필요할 수 있습니다.", "Copy this page’s address and open it in Chrome. An existing Google session may be reused, but account selection or signing in again may be required.")}</p></section>
          <section><h2>{t("이미 내부 테스트에 참여했어요", "Already enrolled in internal testing?")}</h2><p>{t("내부 테스트와 이번 비공개 테스트는 다릅니다. 내부 테스트 참여 페이지에서 나간 뒤, 2번 링크로 비공개 테스트에 다시 참여하세요.", "Internal and closed tests are different. Leave the internal test, then use step 2 to enroll in this closed test.")}</p></section>
          <section><h2>{t("무엇을 테스트하면 되나요?", "What should I try?")}</h2><p>{t("습관 만들기, 친구와 공동 습관, 스마트폰 사용 시간 확인을 해보세요. NFC 태그가 있다면 Focus Lock도 선택적으로 써보세요. NFC 태그가 없어도 참여할 수 있습니다. 이번 테스트에는 아이폰이 아닌 안드로이드 휴대폰이 필요합니다.", "Try habits, shared habits with friends, and phone-use records. If you have an NFC tag, optionally try Focus Lock. An NFC tag is not required, but an Android phone is.")}</p></section>
          <section><h2>{t("참여·설치가 자동으로 확인되나요?", "Is participation or installation automatically verified?")}</h2><p>{t("이 페이지는 Google 계정·참여 여부·설치 상태를 조회하지 않으며, 버튼 클릭을 완료로 기록하지 않습니다. 그룹 가입만으로 Google Play 테스트 참여가 완료되지는 않습니다. 그룹 회원 목록과 이메일은 그룹 운영자만 확인하도록 설정합니다.", "This page does not read your Google account, enrollment, or installation status, and does not treat a click as completion. Group membership is separate from Play enrollment. The member list and email addresses are restricted to group administrators.")}</p></section>
          <section><h2>{t("도움이 필요해요", "Need a hand?")}</h2><p><a href={"mailto:" + testSupportEmail}>{testSupportEmail}</a><br />{t("문의 메일은 NEICA 운영자에게 전달됩니다. 비밀번호·인증번호는 보내지 마세요.", "Emails go to NEICA. Never send passwords or verification codes.")}</p></section>
        </div>
      </details>
    </main>
    <footer className="site-copyright"><a href={localizedSiteUrl("privacy/", en ? "en" : "ko")}>{t("개인정보처리방침", "Privacy policy")}</a><span>©2026 NEICA. All rights reserved.</span></footer>
  </>;
}
document.documentElement.lang = en ? "en" : "ko";
if (en) document.title = "RITMUS Android test — NEICA";
createRoot(document.getElementById("root")!).render(<App />);
