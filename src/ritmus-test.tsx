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
    body: t("‘그룹 가입’을 누르면 바로 가입돼요.", "Select ‘Join group’. No approval needed."),
    action: t("그룹 가입하기", "Join group"), url: testerGroupUrl },
  { title: t("테스트 참여", "Join the test"),
    body: t("Google Play에서 ‘테스터 되기’를 누르세요.", "Select ‘Become a tester’ on Google Play."),
    action: t("테스트 참여하기", "Join test"), url: testJoinUrl },
  { title: t("앱 설치", "Install RITMUS"),
    body: t("휴대폰의 Play 스토어에서 설치하세요.", "Install from the Play Store on your phone."),
    action: t("앱 설치하기", "Install app"), url: testInstallUrl },
];

function App() {
  return <>
    <a className="skip-link" href="#main">{t("본문으로 이동", "Skip to content")}</a>
    <SiteHeader page="ritmus-test" locale={en ? "en" : "ko"} />
    <main id="main" className="test-page">
      <header className="test-intro">
        <h1>{t("RITMUS 안드로이드 테스트", "RITMUS Android test")}</h1>
        <span className="test-edition">{t("안드로이드 휴대폰 · 한국 Google Play 계정", "Android phone · South Korean Google Play account")}</span>
      </header>
      <div className="test-account-note">{t("세 단계 모두 [같은 Google 계정]으로 진행하세요.", "Use [the same Google account] for all three steps.")}</div>
      {!testerGroupUrl && <p className="test-pending" role="status">{t("그룹 연결을 준비하고 있습니다. 연결 후 이 페이지에서 바로 참여할 수 있어요.", "The tester group is being connected. Please return once setup is complete.")}</p>}
      {testerGroupUrl && groupConnectionPending && <p className="test-pending" role="status"><strong>[{t("연결 반영 중", "UPDATE PENDING")}]</strong> {t("그룹 가입은 가능합니다. 2·3번은 Google 반영 후 이용할 수 있어요.", "Group signup is open. Steps 2–3 will be available after Google publishes the update.")}</p>}
      <section className="test-steps" aria-label={t("참여 순서", "How to join")}>
        {steps.map((step, index) => <article className="test-step" key={index}>
          <span className="test-number" aria-hidden="true">0{index + 1}</span>
          <div className="test-step-copy"><h2>{step.title}</h2><p>{step.body}</p></div>
          {step.url && testerGroupUrl ? <a className={"test-action" + (index === 0 ? " primary" : "")} href={step.url} target="_blank" rel="noopener noreferrer">{step.action}<span aria-hidden="true">↗</span><span className="sr-only">{t(" (새 탭)", " (new tab)")}</span></a> : <button className="test-action" disabled>{t("연결 준비 중", "Setup in progress")}</button>}
        </article>)}
      </section>
      <p className="test-join-note">{t("각 단계 후 이 페이지로 돌아와 다음 버튼을 누르세요.", "Return here after each step to continue.")}</p>
      <div className="test-followup"><p>{t("[14일 연속] 테스트 참여를 유지하며 앱을 사용해 주세요.", "Stay enrolled for [14 consecutive days] and use the app.")}</p><a href={feedback} className="test-feedback">{t("의견 보내기", "Send feedback")} ↗</a></div>
      <details className="test-help"><summary>{t("설치가 안 되나요?", "Trouble installing?")}</summary>
        <div className="test-faq">
          <ul>
            <li>{t("Chrome에서 열고, Play 스토어와 같은 계정인지 확인하세요.", "Open in Chrome using the same account as the Play Store.")}</li>
            <li>{t("그룹 가입과 ‘테스터 되기’를 모두 완료하세요. 반영에는 시간이 걸릴 수 있어요.", "Complete both group signup and ‘Become a tester’. Updates may take time.")}</li>
            <li>{t("기존 내부 테스터는 내부 테스트에서 나간 후 2번으로 다시 참여하세요.", "Internal testers: leave the internal test, then rejoin via step 2.")}</li>
          </ul>
          <p>{t("문의: ", "Help: ")}<a href={"mailto:" + testSupportEmail}>{testSupportEmail}</a></p>
        </div>
      </details>
    </main>
    <footer className="site-copyright"><a href={localizedSiteUrl("privacy/", en ? "en" : "ko")}>{t("개인정보처리방침", "Privacy policy")}</a><span>©2026 NEICA. All rights reserved.</span></footer>
  </>;
}
document.documentElement.lang = en ? "en" : "ko";
if (en) document.title = "RITMUS Android test — NEICA";
createRoot(document.getElementById("root")!).render(<App />);
