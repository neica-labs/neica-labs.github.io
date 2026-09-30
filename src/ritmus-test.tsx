import { createRoot } from "react-dom/client";
import SiteHeader from "./app/SiteHeader";
import { readLocale } from "./app/i18n";
import { localizedSiteUrl } from "./lib/urls";
import { testerGroupUrl, groupConnectionPending, testJoinUrl, testSupportEmail } from "./ritmus-test-config";
import "./styles.css";
import "./ritmus-test.css";

const en = readLocale() === "en";
const t = (ko: string, english: string) => en ? english : ko;
const feedback = "mailto:" + testSupportEmail + "?subject=" + encodeURIComponent("[RITMUS] Android 테스트 피드백");
const steps = [
  { title: t("그룹 가입", "Join the group"),
    body: t("내 Google 계정으로 로그인한 뒤 ‘그룹 가입’을 누르세요. 승인 대기는 없어요.", "Sign in with your Google account and select ‘Join group’. No approval needed."),
    action: t("그룹 가입하기", "Join group"), url: testerGroupUrl },
  { title: t("테스트 참여·설치", "Join & install"),
    body: groupConnectionPending
      ? t("Google 심사 완료 후 ‘테스터 되기’ → 다운로드 순서로 진행하세요.", "After Google’s review is complete, select ‘Become a tester’, then follow the download link.")
      : t("‘테스터 되기’를 누른 뒤, 같은 화면의 다운로드 링크로 설치하세요.", "Select ‘Become a tester’, then follow the download link on that page to install."),
    action: t("테스트 참여·설치", "Join & install"), url: testJoinUrl },
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
      <div className="test-account-note">{t("Play 스토어에서 쓰는 [같은 Google 계정]으로 진행하세요.", "Use [the same Google account] you use in the Play Store.")}</div>
      {!testerGroupUrl && <p className="test-pending" role="status">{t("그룹 연결을 준비하고 있습니다. 연결 후 이 페이지에서 바로 참여할 수 있어요.", "The tester group is being connected. Please return once setup is complete.")}</p>}
      <section className="test-steps" aria-label={t("참여 순서", "How to join")}>
        {steps.map((step, index) => <article className="test-step" key={index}>
          <span className="test-number" aria-hidden="true">0{index + 1}</span>
          <div className="test-step-copy"><h2>{step.title}</h2>
            {index === 1 && testerGroupUrl && groupConnectionPending && <aside className="test-review-notice" role="status">
              <strong>[{t("현재 Google 심사 중", "GOOGLE REVIEW IN PROGRESS")}]</strong>
              <p>{t("앱의 테스트 연결 심사는 제출 후 몇 시간~7일, 예외적으로 더 오래 걸릴 수 있어요. 가입자 개인의 승인 대기가 아닙니다.", "Google’s review of the app’s test-access change can take a few hours to 7 days after submission, or longer in exceptional cases. This is not approval of your individual membership.")}</p>
              <p>{t("‘App not available’이 뜨면 재가입하지 말고 심사 완료 후 다시 시도해 주세요.", "If you see ‘App not available’, keep your group membership and try again after the review.")}</p>
            </aside>}
            <p>{step.body}</p>
          </div>
          {step.url && testerGroupUrl ? <a className={"test-action" + (index === 0 ? " primary" : "")} href={step.url} target="_blank" rel="noopener noreferrer">{step.action}<span aria-hidden="true">↗</span><span className="sr-only">{t(" (새 탭)", " (new tab)")}</span></a> : <button className="test-action" disabled>{t("연결 준비 중", "Setup in progress")}</button>}
        </article>)}
      </section>
      <p className="test-join-note">{groupConnectionPending
        ? t("그룹은 지금 가입할 수 있어요. 2번은 Google 심사 완료 후 진행해 주세요.", "You can join the group now. Continue to step 2 after Google’s review.")
        : t("그룹 가입 후 이 페이지로 돌아와 2번을 누르세요. 별도 이메일 제출은 필요 없어요.", "After joining the group, return here for step 2. No separate email form is needed.")}</p>
      <div className="test-followup"><p>{t("[14일 연속] 테스트 참여를 유지하며 앱을 사용해 주세요.", "Stay enrolled for [14 consecutive days] and use the app.")}</p><a href={feedback} className="test-feedback">{t("의견 보내기", "Send feedback")} ↗</a></div>
      <details className="test-help"><summary>{t("설치가 안 되나요?", "Trouble installing?")}</summary>
        <div className="test-faq">
          <ul>
            <li>{t("Chrome에서 열고, Play 스토어와 같은 계정인지 확인하세요.", "Open in Chrome using the same account as the Play Store.")}</li>
            <li>{t("‘그룹 가입’이 안 보이면 먼저 Google에 로그인하세요. 이미 가입했다면 2번으로 진행하세요.", "If ‘Join group’ is missing, sign in to Google first. Already a member? Continue to step 2.")}</li>
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
