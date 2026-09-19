# NEICA Homepage

React·TypeScript·Vite 정적 홈페이지. 기존 편집기와 독립적으로 실행하며 GitHub Pages에 배포합니다. COMMUNITY 이메일 사전 등록은 별도의 Cloudflare Worker·비공개 D1에 저장하도록 준비되어 있습니다. [저장 구조와 연결 절차](newsletter-api/README.md)를 참고하세요.

- [홈페이지 기획서](../planner/homepage/PLAN.md): 화면, 여백, 메뉴, 캐러셀 동작, 운영 흐름.
- [코드 아키텍처](ARCHITECTURE.md): 모듈 책임, 콘텐츠 계약, 검수·공개 분리, 빌드·배포와 검증.
- [전체 프로젝트 계획](../NEICA_PROJECT_PLAN.md): planner·contents·contents_editor·homepage·others 분류.

## 실행

이 `homepage` 폴더에서 실행합니다.

```sh
npm ci
npm run dev:review
```

주소: <http://127.0.0.1:4174/>. 기존 편집기 4173 포트와 충돌하지 않습니다.

- HOME: PC 3열, 태블릿 2열, 모바일 1열. 넓은 여백, 잘리지 않는 표지.
- 메뉴: HOME → ABOUT → LABS → COMMUNITY → LINK.
- 캐러셀: 전체 화면, 화살표·키보드·스와이프, 50–400% 확대·축소, 드래그·핀치.
- 키보드 `+`, `-`, `0`: 확대, 축소, 화면 맞춤. `Esc`: 닫기. 뒤로가기도 지원.
- ⓘ 버튼: 캡션·크레딧·출처 패널. PNG 위에 다시 렌더링하지 않음.
- `?post=콘텐츠ID&slide=장번호`로 해당 장에 직접 접근.
- 링크 카드는 팝업 대신 해당 주소로 이동.

현재 실제 PNG가 있는 **4개 포스트·29장**이 로컬 검수에 연결되어 있습니다. 공개 목록은 아직 비어 있습니다. LABS·COMMUNITY·LINK의 실제 프로젝트 및 공식 계정은 확정 후 채웁니다.

## 콘텐츠 연동

```text
편집기 저장 + PNG 내보내기
  → 로컬 검수 → 발행 후보 스냅샷 → 사용자 확정
  → 공개 묶음 생성 → GitHub 커밋·푸시 → Pages 배포
```

`dev:review`는 현재 폴더의 `neica-project.json`(우선) 또는 `project.json`과 `output/01.png …`를 읽습니다. 출력 변경을 감지하여 미리보기를 갱신합니다. JSON의 장 수보다 많은 옛 PNG는 무시합니다. `npm run dev`는 공개용 묶음만 보여 줍니다.

**기존 편집기 출력에는 완료 manifest가 없으므로, PNG 내보내기가 모두 끝난 뒤 JSON과 이미지가 같은 버전인지 함께 검수해야 합니다.** 출력 중 미리보기가 갱신될 수 있습니다. 홈페이지는 편집 JSON을 수정하거나 원본 PNG를 다시 렌더링하지 않습니다.

콘텐츠 루트는 상위 `contents/`가 있으면 그곳, 없으면 기존 `public/assets/`입니다. 기존 폴더는 옮기지 않았습니다. 별도 위치라면:

```sh
NEICA_CONTENT_ROOT="/absolute/path/to/contents" npm run dev:review
```

### 발행 후보와 확정

```sh
npm run content:prepare -- --post "/absolute/path/to/post-folder"
```

`releases/<revision>/`에 PNG·문구·출처의 스냅샷을 만듭니다. 이 명령은 승인이 아닙니다. 사용자가 후보 PNG와 문구·사진 일치·출처·권리·캡션을 검수합니다. 검수한 정확한 64자리 revision을 사용하여 확정합니다.

```sh
npm run content:approve -- --post "/absolute/path/to/post-folder" --confirm-revision "검수한_64자리_revision"
npm run content:sync
npm run build
npm run preview
```

`content:approve`는 홈페이지·인스타그램용 묶음의 승인 기록만 남깁니다. 실제 게시하지 않습니다. 사용자 확정 없이 실행하지 않습니다. `content:sync -- --root "/absolute/path/to/contents"`로 별도 콘텐츠 루트를 지정할 수도 있습니다.

동기화는 확정 기록, 버전 지문, 이미지 바이트·치수·참조를 검사합니다. 원본 PNG와 540/1080px 표지 WebP를 `public/content/`에 준비하고 `src/generated/catalog.json`을 갱신합니다. 확정본 이후 초안을 수정해도 공개본은 유지됩니다. 깨진 확정본은 조용히 빼지 않고 동기화를 실패시킵니다. 검수본은 공개 빌드할 수 없습니다.

현재·직전 공개 묶음 자산을 보존합니다. 새 묶음을 저장소에 반영하고 푸시해야 인터넷 사이트도 갱신됩니다. 홈페이지 게시와 인스타그램 게시 완료는 별개입니다.

### 표지·순서·링크 카드

포스트 폴더에 선택적으로 `content.json`을 둡니다. `id`는 고유하며 한 번 정하면 유지합니다. `title`, `displayDate`, `order`, `coverSlideId`를 지정할 수 있습니다. 작은 `order` 우선, 같은 순위에서는 최신 날짜 우선입니다. `coverSlideId` 생략 시 첫 장입니다. 공개 메타데이터 변경도 후보 생성·검수·확정을 다시 거칩니다.

링크 카드는 `content.json`과 `cover.png`가 있는 폴더로 만듭니다. 같은 후보·확정 절차를 사용합니다.

```json
{
  "schemaVersion": "neica-content.v1",
  "id": "my-link",
  "type": "link",
  "title": "링크 이름",
  "displayDate": "2026-09-11",
  "href": "https://example.org/",
  "cover": { "path": "cover.png", "alt": "표지 설명" }
}
```

외부 HTTP(S)는 새 탭, `/labs/` 같은 내부 링크는 같은 탭입니다. 실제 주소가 없으면 임의로 채우지 않습니다. `homepageWithdrawn: true`는 다음 동기화에서 카드를 제외하지만 이전 파일 URL의 즉시 삭제는 아닙니다. 민감한 이미지의 완전 삭제는 별도로 처리합니다.

## GitHub 배포

이 패키지가 홈페이지 저장소의 루트가 됩니다. 프로젝트 전체를 업로드하지 않습니다. 새 저장소를 별도 위치에 연결한 뒤 홈페이지 소스·lockfile·공개 카탈로그·확정 이미지 묶음만 반영합니다. `.github/workflows/pages.yml`은 `main` 푸시 시 검사·빌드 후 `dist/`를 배포합니다.

저장소 Settings → Pages → Source를 **GitHub Actions**로 설정합니다. `/저장소명/` 경로도 Pages의 base path로 자동 처리합니다. Actions 성공과 배포된 `build.json`의 `buildId`를 확인합니다.

**현재 새 계정·저장소 URL을 받지 않아 원격 연결과 실제 배포는 하지 않았습니다.** 원본 자료, 편집 JSON, `.cache/`, `node_modules/`는 공개 저장소에 넣지 않습니다.

구현 기준: [GitHub Pages 공식 문서](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages), [Vite 배포 문서](https://vite.dev/guide/static-deploy.html#github-pages). 확인일 2026-09-11.

## 검사

```sh
npm test
npm run build
npx playwright install chromium
npm run test:browser
npm run test:production
```

- `test`: 승인·버전·변조·링크·중복 경고·경로·좌표 단위 검사.
- `build`: 공개 콘텐츠 → 타입 → 정적 빌드 → 배포 파일 검사.
- `test:browser`: 검수 서버가 실행 중이어야 합니다. 실제 PNG, 마지막 장, 반응형, 로딩 경합·재시도, 확대·터치, 포커스·스크롤 복원 검사.
- `test:production`: 임시 테스트 데이터만 사용하여 `/neica-test/` 하위 경로, 링크 카드, 직접 접근·새로고침, 404, buildId 검사. 실제 콘텐츠 승인은 수정하지 않습니다.

캡처와 결과는 `.cache/qa/`에 있습니다. Chromium 자동화 확인이며, 실제 iPhone Safari의 핀치·회전·스크롤은 별도 기기 검수가 필요합니다.

## 코드 위치와 남은 범위

`src/app`은 헤더·메뉴·공식 링크 설정, `src/content`는 HOME 카드, `src/viewer`는 팝업·주소·이미지·확대·터치, `scripts`는 콘텐츠 처리·검증, `tests`는 단위 테스트입니다. `npm run format`으로 형식을 정리합니다.

편집기의 확정·게시 버튼, 내보내기 완료 manifest, GitHub 자동 커밋, 인스타그램 API 게시는 아직 구현하지 않았습니다. 현재 홈페이지에서 제공하는 승인·동기화 명령과 구분합니다.
