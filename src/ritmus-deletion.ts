import './ritmus-deletion.css';
import {initializeApp} from 'firebase/app';
import {initializeAuth, inMemoryPersistence, browserPopupRedirectResolver, GoogleAuthProvider, OAuthProvider, signInWithPopup, reauthenticateWithPopup, revokeAccessToken, signOut} from 'firebase/auth';
import {getFunctions, httpsCallable} from 'firebase/functions';
import {runDeletion} from './lib/deletion-flow.mjs';

const english = new URLSearchParams(location.search).get('lang') === 'en';
const choose = (ko: string, en: string) => english ? en : ko;
document.documentElement.lang = english ? 'en' : 'ko';
document.title = choose('RITMUS 계정 삭제 — NEICA', 'Delete RITMUS account — NEICA');
document.querySelector('#deletion-root')!.innerHTML = `
<header><a href="/">NEICA</a><a href="?lang=${english ? 'ko' : 'en'}" id="language">${english ? '한국어' : 'English'}</a></header>
<h1>${choose('RITMUS 계정 삭제', 'Delete your RITMUS account')}</h1>
<p>${choose('앱을 다시 설치하지 않아도, 가입할 때 사용한 계정으로 본인 확인 후 삭제할 수 있습니다. 로그인만으로는 삭제되지 않습니다.', 'You can delete your account without reinstalling the app. Use the same Google or Apple account you used for RITMUS. Signing in alone does not delete anything.')}</p>
<section aria-labelledby="scope"><h2 id="scope">${choose('[삭제되는 정보]', '[What will be deleted]')}</h2>
<p>${choose('RITMUS 로그인 계정, 프로필·@ID, 개인 서버 백업, 친구 관계와 공동 습관의 계정 관련 데이터를 삭제하거나 익명화합니다. iOS와 Android에서 같은 계정을 사용했다면 함께 적용됩니다. Google·Apple 계정 자체는 삭제하지 않습니다.', 'Your RITMUS sign-in account, profile/handle, private server backups, friendships and associated shared-habit data are deleted or anonymized. This applies across iOS and Android when using the same account. Your Google or Apple account itself is not deleted.')}</p>
<h2>${choose('[삭제 전 확인]', '[Before you continue]')}</h2><ul>
<li>${choose('삭제는 되돌릴 수 없습니다. 필요한 기록을 먼저 내보내고, 사용 중인 기기의 Focus Lock을 해제하세요.', 'Deletion cannot be undone. Export records you want to keep and unlock Focus Lock on your devices first.')}</li>
<li>${choose('다른 기기에 남은 오프라인 기록과 Notion으로 이미 내보낸 행은 이 웹페이지가 원격으로 지우지 못합니다. 해당 기기·서비스에서 직접 삭제하세요.', 'This page cannot remotely erase offline files on your devices or rows already exported to Notion. Remove those in the relevant device or service.')}</li>
<li>${choose('재생성을 막는 최소 삭제 표식과 익명화된 안전·신고 기록은 보안·법적 의무에 필요한 범위에서 남을 수 있습니다.', 'Minimal deletion markers and anonymized safety/report records may remain as necessary for security or legal obligations.')}</li></ul></section>
<section class="card" aria-labelledby="sign-in-title"><h2 id="sign-in-title">1. ${choose('기존 계정으로 로그인', 'Sign in to your existing account')}</h2>
<div class="buttons" id="sign-in"><button id="google">Google${choose('로 로그인', ' sign-in')}</button><button id="apple">Apple${choose('로 로그인', ' sign-in')}</button></div>
<p id="account" hidden></p><button id="sign-out" hidden>${choose('다른 계정 사용', 'Use another account')}</button>
<div id="confirmation" hidden><h2>2. ${choose('삭제 확인', 'Confirm deletion')}</h2>
<label class="confirm"><input type="checkbox" id="confirm"/><span>${choose('위 계정의 RITMUS 데이터가 삭제되며 복구할 수 없음을 이해했습니다. 필요한 기록을 보관했고 기기의 집중 잠금을 해제했습니다.', 'I understand that RITMUS data for the account above will be deleted and cannot be restored. I have backed up needed records and unlocked Focus on my devices.')}</span></label>
<div class="buttons"><button class="primary" id="delete" disabled>${choose('본인 재확인 후 영구 삭제', 'Verify again and permanently delete')}</button></div></div>
<p id="status" role="status" aria-live="polite"></p></section>
<footer><a href="https://ritmus-notion-oauth.just-habit-it-oauth-worker.workers.dev/privacy">${choose('개인정보처리방침', 'Privacy policy')}</a><p>${choose('도움이 필요하면', 'Need help?')} <a href="mailto:neica.labs@gmail.com">neica.labs@gmail.com</a><br/>${choose('비밀번호·인증번호를 보내지 마세요.', 'Never send passwords or verification codes.')}</p></footer>`;

const element = <T extends HTMLElement>(id: string) => document.getElementById(id) as T;
const status = (message: string, error = false) => {
  element('status').textContent = message;
  element('status').dataset.error = String(error);
};
// Public Firebase web configuration. No analytics SDK, admin key or stored password.
const app = initializeApp({projectId:'tickflow-d24e5',appId:'1:937585895621:web:4d88739b8ebdd06395e8ac',apiKey:'AIzaSyBj6FXhe4hbfdXPZCqJp0RvZ62Csr8zI7s',authDomain:'tickflow-d24e5.firebaseapp.com'});
const auth = initializeAuth(app, {persistence:inMemoryPersistence, popupRedirectResolver:browserPopupRedirectResolver});
const functions = getFunctions(app, 'asia-northeast3');
const preflight = httpsCallable<Record<string,never>,{exists:boolean;pending:boolean;dataDeleted:boolean}>(functions,'webAccountDeletionStatus');
const erase = httpsCallable<{effectiveLocalDay:string},{completed:boolean}>(functions,'webDeleteAccountData',{timeout:540000});
const finalize = httpsCallable<Record<string,never>,{ok:boolean}>(functions,'webFinalizeAccountDeletion');
let busy = false;
let providerID = '';
let finalizationAttempted = false;
function lock(value:boolean) {
  busy=value;
  for (const id of ['google','apple','sign-out','confirm']) (element(id) as HTMLButtonElement|HTMLInputElement).disabled=value;
  element<HTMLButtonElement>('delete').disabled=value || !element<HTMLInputElement>('confirm').checked;
}
function provider(id:string) {
  if (id === 'google.com') { const p = new GoogleAuthProvider(); p.setCustomParameters({prompt:'select_account'}); return p; }
  const p = new OAuthProvider('apple.com'); p.addScope('email'); p.addScope('name'); return p;
}
function failure(error:unknown) {
  const code = (error as {code?:string})?.code || '';
  if (/popup-closed|cancelled-popup|user-cancelled/.test(code)) return choose('본인 확인을 취소했습니다.','Verification was cancelled.');
  if (/popup-blocked/.test(code)) return choose('브라우저에서 팝업을 허용한 후 다시 시도해 주세요.', 'Allow pop-ups in your browser and try again.');
  if (/user-mismatch/.test(code) || (error as Error)?.message === 'account-changed') return choose('처음 로그인한 계정과 다릅니다. 같은 계정으로 다시 확인해 주세요.', 'The account changed. Verify using the original account.');
  if (/unauthorized-domain|operation-not-allowed|api-key|internal/.test(code)) return choose('로그인 설정 또는 서버 연결을 확인할 수 없습니다. 잠시 후 다시 시도하거나 지원 이메일로 문의하세요.', 'Sign-in configuration or server connection is unavailable. Try later or contact support.');
  return choose('완료를 확인하지 못했습니다. 일부 삭제가 진행됐을 수 있습니다. 같은 계정으로 본인 확인 후 다시 시도해 주세요. 계속 실패하면 지원 이메일로 문의하세요.', 'Completion could not be confirmed; deletion may be partially complete. Verify the same account and retry. Contact support if this continues.');
}
async function login(id:string) {
  if(busy) return;
  lock(true); status(choose('로그인 중…','Signing in…'));
  try {
    const result=await signInWithPopup(auth,provider(id));
    providerID=id;
    element('account').textContent=choose('삭제 대상: ','Account to delete: ')+(result.user.email || result.user.uid);
    element('account').hidden=false; element('sign-out').hidden=false; element('sign-in').hidden=true;
    const {data}=await preflight({});
    if(auth.currentUser?.uid!==result.user.uid) throw new Error('account-changed');
    element('confirmation').hidden=!data.exists;
    status(data.exists ? choose('계정을 확인했습니다. 삭제 범위를 확인하고 아래에서 진행하세요.', 'Account verified. Review the scope and confirm below.') : choose('이 로그인에는 RITMUS 프로필이나 삭제 요청 기록이 없습니다. 앱에서 사용한 로그인 방법과 계정을 확인하세요.', 'No RITMUS profile or deletion record was found. Check the provider and account you used in the app.'));
  } catch(error){status(failure(error),true);} finally{lock(false);}
}
element('google').onclick=()=>void login('google.com');
element('apple').onclick=()=>void login('apple.com');
element('sign-out').onclick=async()=>{if(busy)return; await signOut(auth); location.reload();};
element('confirm').onchange=()=>lock(busy);
element('delete').onclick=async()=>{
  const user=auth.currentUser;
  if(busy || !user || !element<HTMLInputElement>('confirm').checked)return;
  lock(true); status(choose('같은 계정으로 본인 확인을 진행하세요.','Verify again with the same account.'));
  let appleToken:string|undefined;
  finalizationAttempted=false;
  try {
    await runDeletion({uid:user.uid,currentUID:()=>auth.currentUser?.uid,
      reauthenticate:async()=>{
        const result=await reauthenticateWithPopup(user,provider(providerID));
        if(providerID==='apple.com'){
          appleToken=OAuthProvider.credentialFromResult(result)?.accessToken;
          if(!appleToken)throw new Error('missing-apple-token');
        }
        // Refuse linked Apple accounts unless Apple authorization is present too.
        if(user.providerData.some(p=>p.providerId==='apple.com') && !appleToken)throw new Error('use-apple-sign-in');
        await user.getIdToken(true);
      },
      eraseData:async()=>{
        status(choose('데이터를 삭제하고 있습니다. 이 창을 닫지 마세요.','Deleting data. Keep this page open.'));
        const now=new Date(); const day=[now.getFullYear(),String(now.getMonth()+1).padStart(2,'0'),String(now.getDate()).padStart(2,'0')].join('-');
        return (await erase({effectiveLocalDay:day})).data;
      },
      revoke:async()=>{if(appleToken)await revokeAccessToken(auth,appleToken);},
      finalize:async()=>{finalizationAttempted=true;return (await finalize({})).data;}
    });
    appleToken=undefined;
    await signOut(auth).catch(()=>{});
    element('confirmation').hidden=true; element('sign-out').hidden=true;
    status(choose('RITMUS 계정 및 서버 데이터 삭제가 완료됐습니다. 다른 기기의 오프라인 기록과 Notion에 내보낸 행은 직접 확인해 주세요.', 'Your RITMUS account and server data have been deleted. Separately remove offline device records and exported Notion rows.'));
  } catch(error){
    appleToken=undefined;
    status((error as Error)?.message==='use-apple-sign-in' ? choose('이 계정에는 Apple 로그인이 연결돼 있습니다. 다른 계정 사용을 누르고 Apple로 로그인해 삭제해 주세요.','This account has Apple sign-in linked. Use another account, then sign in with Apple to delete.') : finalizationAttempted ? choose('마지막 계정 삭제 응답을 확인하지 못했습니다. 완료 여부를 확인하려면 지원 이메일로 문의해 주세요. 성공으로 표시하지 않았습니다.','The final deletion response could not be confirmed. Contact support to check completion; success has not been assumed.') : failure(error),true);
  } finally {lock(false); element<HTMLInputElement>('confirm').checked=false; element<HTMLButtonElement>('delete').disabled=true;}
};
window.addEventListener('beforeunload',event=>{if(busy){event.preventDefault();event.returnValue='';}});
