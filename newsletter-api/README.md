# COMMUNITY 사전 등록과 접수 메일

홈페이지(GitHub Pages)의 등록 폼 → Cloudflare Worker → 비공개 D1의 `early_access_signups`에 저장합니다. 새로 접수된 주소에는 Google Apps Script의 `MailApp`으로 짧은 접수 안내를 한 번 보냅니다. 발신자는 `neica.labs@gmail.com`이며, 이 메일은 **주소 소유 확인이나 뉴스레터 발행이 아닙니다.**

이메일 주소·비밀키·구독자 명단은 공개 GitHub 저장소, 브라우저 저장소, 정적 빌드 파일에 넣지 않습니다. Worker는 명단 조회 API를 제공하지 않습니다. Ritmus의 데이터베이스와도 연결하지 않습니다.

## 데이터와 처리

- `email`: 소문자로 정규화한 유일한 연락 주소.
- `locale`: KO/EN 접수 메일 언어.
- `consent_version`, `consent_at`: 동의 문구 버전과 접수 시점.
- `status`: 현재는 `pending`. 취소 시 `unsubscribed`를 사용합니다. `confirmed`는 향후 실제 소유 확인을 도입할 때만 사용합니다.
- `receipt_claimed_at`, `receipt_sent_at`: 동시 요청과 중복 메일 방지용 상태. 발송에 실패하면 claim을 풀어 같은 주소로 재시도할 수 있습니다.
- `created_at`, `updated_at`: 운영 기록. 이름·IP·브라우저 정보는 D1에 저장하지 않습니다.

기존 주소는 중복 저장하거나 재발송하지 않습니다. 다만 접수 메일이 아직 발송되지 않은 기존 `pending` 주소는 재신청 시 한 번 발송합니다. 사용자가 신청하지 않았다면 메일에 답장하여 삭제를 요청할 수 있습니다. 삭제 요청은 `neica.labs@gmail.com`으로 받습니다.

## 메일 디자인

`google-apps-script/Code.gs`에 한국어·영어 고정 템플릿이 있습니다. 홈페이지와 같이 흰 배경, 넉넉한 여백, SD Gothic Neo 계열 본문, SF Mono 계열 라벨과 얇은 구분선 하나만 씁니다. 원격 로고가 차단되어도 제목·본문은 그대로 읽힙니다. 발신자·제목·본문은 서버에서 고정하므로 공개 폼 요청으로 임의 메일을 작성할 수 없습니다.

## 배포 설정과 운영 상태

2026-09-19에 NEICA Cloudflare 계정의 D1 스키마, Worker secret, Worker와 `neica.labs@gmail.com` 소유 Apps Script 웹 앱을 연결했습니다. `neica.labs+receipt-test@gmail.com`으로 실제 발송·수신·중복 요청을 확인하고, 시험용 D1 레코드는 삭제했습니다. Google 계정의 Apps Script 프로젝트 이름은 `NEICA community receipt mail`입니다. 아래는 다른 환경에서 재구성하거나 변경할 때의 순서입니다.

1. `wrangler d1 migrations apply neica-early-access --remote`로 `0002_receipt_delivery.sql`을 적용합니다.
2. `neica.labs@gmail.com`으로 Google Apps Script 프로젝트를 만들고 `google-apps-script/Code.gs`를 붙여 넣습니다. 프로젝트 설정의 스크립트 속성에 강력한 무작위 `NEICA_RECEIPT_SECRET`을 저장합니다.
3. 웹 앱으로 배포합니다. 실행 계정은 `neica.labs@gmail.com`, 접근은 `Anyone`이며, Google의 메일 발송 권한을 승인해야 합니다. 웹 앱 URL은 `https://script.google.com/macros/s/.../exec` 형태입니다. 공개 URL 자체는 비밀키가 아닙니다.
4. Cloudflare Worker의 secret `MAIL_SHARED_SECRET`에 **동일한 값**을 넣고, `MAIL_ENDPOINT`에 웹 앱 URL을 저장합니다. 어느 값도 저장소에 커밋하지 않습니다.
5. Worker를 배포합니다. 허용 출처는 `https://neica-labs.github.io`만 유지합니다. 홈페이지 주소를 바꾸면 `ALLOWED_ORIGIN`도 바꿉니다.
6. 접수 메일과 실패·중복·재시도를 시험한 다음 홈페이지 문구를 배포합니다. `NEICA_SIGNUP_API` GitHub 저장소 변수는 기존 Worker의 `/subscribe`를 가리킵니다.

Cloudflare의 접속지별 요청 제한은 분당 10회입니다. Google Apps Script 개인 계정의 이메일 발송 수에는 [일일 할당량](https://developers.google.com/apps-script/guides/services/quotas)이 적용됩니다. 할당량 초과 또는 발송 오류 시 Worker는 성공으로 답하지 않고 재시도를 허용합니다. 대량 발송이나 정식 뉴스레터 발행에는 별도의 발송 서비스와 구독 취소 체계가 필요합니다.
