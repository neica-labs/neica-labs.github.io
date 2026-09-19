# COMMUNITY 사전 등록 저장 구조

홈페이지(GitHub Pages)에서 `POST /subscribe` → Cloudflare Worker → 비공개 D1 데이터베이스의 `early_access_signups`로 저장합니다. 이메일은 공개 GitHub 저장소, 브라우저 저장소, 빌드 파일에 넣지 않습니다. Worker는 이메일을 읽어 되돌려주거나 명단 조회 API를 제공하지 않습니다.

Cloudflare의 NEICA 계정에 `neica-early-access` D1을 별도로 만들었습니다. Ritmus의 데이터베이스와 연결하지 않습니다. Worker는 배포했고 GitHub 저장소의 `NEICA_SIGNUP_API` 변수도 설정했습니다. 홈페이지 빌드에 이 변수가 전달되면 입력 폼이 활성화됩니다.

## 저장 필드

- `email`: 유일한 연락 주소. 소문자 정규화, 중복 접수는 추가 저장 없이 같은 응답.
- `locale`: KO/EN 발송 언어.
- `consent_version`, `consent_at`: 동의 문구의 버전과 접수 시점.
- `status`: `pending` → 향후 이메일 확인 후 `confirmed` → 철회 시 `unsubscribed`.
- `created_at`, `updated_at`: 운영 기록. IP, 이름, 브라우저 정보는 저장하지 않음.

사전 등록은 **뉴스레터 발송 동의의 완료가 아닙니다.** 발송 기능을 붙일 때 이메일 소유 확인과 구독 취소 수단을 먼저 마련합니다. 삭제 요청은 `neica.labs@gmail.com`으로 받으며, 운영자가 D1에서 해당 레코드를 삭제합니다. 보유 기간과 실제 운영 방식을 공개 안내문과 맞춰야 합니다.

## Cloudflare 연결 절차

1. NEICA가 관리할 Cloudflare 계정으로 로그인합니다. `wrangler.jsonc`의 DB ID는 이 계정의 전용 D1을 가리키며 비밀번호는 아닙니다.
2. 새 환경에서는 `wrangler d1 migrations apply neica-early-access --remote`로 아직 적용되지 않은 스키마를 적용합니다.
3. `wrangler deploy`로 API를 배포합니다. 출처는 `https://neica-labs.github.io`만 허용합니다. 홈페이지 주소가 바뀌면 `ALLOWED_ORIGIN`도 함께 변경합니다.
4. GitHub 저장소 변수 `NEICA_SIGNUP_API`에 배포된 API 주소의 `/subscribe`까지 설정하고 홈페이지를 다시 배포합니다.
5. 실제 주소로 시험 등록하고 D1에서 저장을 확인한 뒤 공개합니다. 수신·삭제·중복·오류 동작도 함께 확인합니다.

공개 폼에는 Cloudflare의 요청 제한(동일 접속지에서 분당 10회)과 봇용 숨김 필드를 적용했습니다. 뉴스레터 발송 전에는 이메일 소유 확인과 메일 내 구독 취소 수단을 구현해야 합니다. 관리 명단은 Cloudflare 계정에서만 확인·내보냅니다.
