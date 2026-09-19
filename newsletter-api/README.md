# COMMUNITY 사전 등록 저장 구조

홈페이지(GitHub Pages)에서 `POST /subscribe` → Cloudflare Worker → 비공개 D1 데이터베이스의 `early_access_signups`로 저장합니다. 이메일은 공개 GitHub 저장소, 브라우저 저장소, 빌드 파일에 넣지 않습니다. Worker는 이메일을 읽어 되돌려주거나 명단 조회 API를 제공하지 않습니다.

현재 상태: 화면·API·DB 스키마의 소스만 준비했습니다. Cloudflare 계정에서 실제 D1을 만들고 Worker를 배포한 다음, GitHub 저장소의 `NEICA_SIGNUP_API` 변수에 `https://…workers.dev/subscribe`를 설정해야 입력 폼이 활성화됩니다. 그 전에는 폼이 비활성화되고 접수 준비 중이라고 표시됩니다. **연결·실접수 전까지는 등록된 이메일이 없습니다.**

## 저장 필드

- `email`: 유일한 연락 주소. 소문자 정규화, 중복 접수는 추가 저장 없이 같은 응답.
- `locale`: KO/EN 발송 언어.
- `consent_version`, `consent_at`: 동의 문구의 버전과 접수 시점.
- `status`: `pending` → 향후 이메일 확인 후 `confirmed` → 철회 시 `unsubscribed`.
- `created_at`, `updated_at`: 운영 기록. IP, 이름, 브라우저 정보는 저장하지 않음.

사전 등록은 **뉴스레터 발송 동의의 완료가 아닙니다.** 발송 기능을 붙일 때 이메일 소유 확인과 구독 취소 수단을 먼저 마련합니다. 삭제 요청은 `neica.labs@gmail.com`으로 받으며, 운영자가 D1에서 해당 레코드를 삭제합니다. 보유 기간과 실제 운영 방식을 공개 안내문과 맞춰야 합니다.

## Cloudflare 연결 절차

1. NEICA가 관리할 Cloudflare 계정으로 로그인합니다.
2. `wrangler d1 create neica-early-access`로 D1을 만들고, 반환된 database ID를 `wrangler.example.jsonc`를 복사한 `wrangler.jsonc`에 기록합니다. 실제 설정 파일은 Git에서 제외됩니다.
3. `wrangler d1 migrations apply neica-early-access --remote`로 `0001_early_access.sql`을 적용합니다.
4. `wrangler deploy`로 API를 배포합니다. 출처는 `https://neica-labs.github.io`만 허용합니다. 홈페이지 주소가 바뀌면 `ALLOWED_ORIGIN`도 함께 변경합니다.
5. GitHub 저장소 변수 `NEICA_SIGNUP_API`에 배포된 API 주소의 `/subscribe`까지 설정하고 홈페이지를 다시 배포합니다.
6. 실제 주소로 시험 등록하고 D1에서 저장을 확인한 뒤 공개합니다. 수신·삭제·중복·오류 동작도 함께 확인합니다.

공개 폼이므로 배포 전에는 남용 방지(예: Cloudflare Turnstile 또는 rate limiting)를 더하고, 뉴스레터 발송 전에는 이메일 소유 확인을 구현해야 합니다. 관리 명단은 Cloudflare 계정에서만 확인·내보냅니다.
