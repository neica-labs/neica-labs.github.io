# NEICA 홈페이지 코드 아키텍처

버전: 0.1 · 작성일: 2026-09-11 · 상태: 구현 전 설계

제품 기준: [홈페이지 기획서](../planner/homepage/PLAN.md)  
상위 계획: [NEICA 전체 구조](../NEICA_PROJECT_PLAN.md)

이 문서의 파일명·명령·타입은 구현 명세다. 현재 실행 코드나 게시 연동이 존재한다는 뜻은 아니다.

## 1. 설계 결정

| 항목 | 결정 | 이유 |
| --- | --- | --- |
| 공개 사이트 | React + TypeScript + Vite 정적 빌드 | 현재 편집기의 개발 방식과 이어지고 GitHub Pages에 배포 가능 |
| 페이지 이동 | 5개 실제 HTML 진입점 | `/about/` 등의 직접 접근·새로고침 지원 |
| 캐러셀 | native dialog + img + Pointer Events | 이미 완성한 PNG를 그대로 표시하며 이동·확대 제공 |
| 데이터 저장 | 파일 기반, 확정된 release 사용 | 편집기의 실제 결과와 공개 결과 연결 |
| 원본 위치 | `contents` | 홈페이지에서 복사본을 수동 수정하는 일 방지 |
| 방문자 데이터 | 공개용 catalog + 포스트별 상세 JSON | 가벼운 첫 로딩과 클릭 시 상세 로딩 |
| 상태 관리 | React state/reducer + URL | 작은 사이트에 필요한 상태만 관리 |
| CSS | 토큰과 일반 CSS | 여백·폰트·색을 한곳에서 조정 |
| 이미지 생성 | 빌드 시 표지 썸네일, 뷰어는 원본 PNG | 목록의 속도와 본문의 선명도를 각각 확보 |
| 계정·게시 | 제작·게시 도구에서 실행 | 방문자 페이지의 책임을 콘텐츠 열람에 한정 |

Vite는 다중 HTML 진입점과 하위 배포 경로를 지원한다. 구현 시 선택한 안정 버전의 설정을 사용하고 의존성과 lockfile을 고정한다. [Vite 빌드 문서](https://vite.dev/guide/build.html)

## 2. 시스템 경계

```text
planner                  contents_editor
연구·원고 기준 ──────────→ 편집·렌더·검수·확정
                                │
                                ▼
contents/<series>/<post>/releases/<revision>/
확정 이미지 + 문구 + 출처 + 승인된 게시 대상
                  │
          제작·게시 도구
                  ├────────────→ 인스타그램 게시 모듈
                  │                   └─ 별도 게시 결과 기록
                  ▼
homepage/scripts/sync-content.ts       [로컬 생성 단계]
확정본 검증 → 표지 썸네일 → 공개 JSON·이미지 묶음
                  │
                  ▼
새 GitHub 홈페이지 저장소              [전달 단계]
홈페이지 코드 + 이미 준비된 공개 데이터
                  │
                  ▼
GitHub Actions: 검사 → 빌드 → Pages 배포
                  │
                  ▼
방문자: HOME → 링크 또는 캐러셀          [브라우저]
```

- 홈페이지 런타임은 `contents_editor/src`나 Konva를 import하지 않는다.
- 홈페이지 빌드는 편집기에서 슬라이드를 다시 렌더하지 않는다.
- GitHub에서는 로컬 `../contents`에 접근하지 않는다. 전달된 공개용 파일만으로 빌드할 수 있어야 한다.
- 렌더러·글꼴·원고가 바뀌었을 때 PNG를 다시 만드는 책임은 편집기 쪽에 있다.
- 이 설계는 홈페이지 구현 범위이며, 인스타그램의 실제 계정 연동은 별도 구현 항목이다.

## 3. 디렉터리와 모듈 책임

```text
homepage/
├── README.md
├── ARCHITECTURE.md
├── package.json
├── package-lock.json
├── vite.config.ts
├── tsconfig.json
├── index.html
├── about/index.html
├── labs/index.html
├── community/index.html
├── link/index.html
├── 404.html
├── .github/workflows/pages.yml       # 공개 저장소 루트에서 실행
│
├── contracts/
│   ├── release.ts                  # 제작 도구에서 받는 확정본의 형식
│   ├── catalog.ts                  # 카드 목록 형식
│   ├── post.ts                     # 캐러셀 상세 형식
│   └── validate.ts                 # JSON의 실제 구조와 버전 검사
│
├── scripts/
│   ├── sync-content.ts             # contents → 홈페이지 공개 데이터
│   ├── validate-content.ts         # 확정 상태·파일·링크·목록 검사
│   ├── build-thumbnails.ts         # 표지 축소본 생성
│   ├── generate-catalog.ts         # 안정적인 순서의 공개 목록 생성
│   ├── prepare-review.ts           # 로컬 검수용 결과 생성
│   └── verify-dist.ts              # 배포 파일·경로·용량 검사
│
├── src/
│   ├── main.tsx                    # 해당 HTML의 페이지 마운트
│   ├── app/
│   │   ├── AppShell.tsx            # 헤더·본문·푸터
│   │   ├── SiteHeader.tsx
│   │   └── siteConfig.ts           # 브랜드·메뉴·공식 링크
│   ├── pages/
│   │   ├── HomePage.tsx
│   │   ├── AboutPage.tsx
│   │   ├── LabsPage.tsx
│   │   ├── CommunityPage.tsx
│   │   └── LinkPage.tsx
│   ├── content/
│   │   ├── ContentGrid.tsx
│   │   ├── ContentCard.tsx         # kind로 캐러셀/링크 분기
│   │   ├── ResponsiveCover.tsx
│   │   └── loadPost.ts             # 클릭한 포스트의 상세 로드
│   ├── viewer/
│   │   ├── CarouselViewer.tsx      # dialog 생명주기·통합
│   │   ├── SlideImage.tsx          # 이미지 로드·decode·오류
│   │   ├── ViewerControls.tsx
│   │   ├── PostInfo.tsx            # 사용자가 펼치는 캡션·출처
│   │   ├── viewerReducer.ts        # 열기·넘기기·로드·닫기
│   │   ├── useZoomPan.ts           # 확대·축소·이동 좌표
│   │   ├── usePointerGesture.ts    # 스와이프·핀치·드래그 판별
│   │   ├── useViewerUrl.ts         # URL·뒤로가기
│   │   └── useScrollLock.ts        # HOME 위치 보존
│   ├── lib/
│   │   ├── assetUrl.ts             # 배포 base와 공개 상대 경로 결합
│   │   └── imageCache.ts           # 현재·인접 장의 준비 상태
│   ├── generated/
│   │   └── catalog.json            # 자동 생성; 빌드에 포함
│   └── styles/
│       ├── tokens.css
│       ├── global.css
│       ├── layout.css
│       ├── content.css
│       └── viewer.css
│
├── public/
│   ├── brand/                      # 파비콘·사이트 공유 이미지
│   └── content/
│       └── <content-id>/<revision>/
│           ├── post.json          # 공개용 상세 데이터
│           ├── cover-540.webp
│           ├── cover-1080.webp
│           ├── 01.png
│           └── ...
│
├── tests/                          # 구현 시 중요한 동작 검증
├── .cache/review/                  # 로컬 검수 전용; 배포에서 제외
└── dist/                           # 최종 생성 파일
```

처음부터 모든 파일을 빈 파일로 만들지는 않는다. UI는 HOME·카드·뷰어 단위부터 만들고 각 기능을 구현할 때 분리한다.

공개 저장소에는 `src/generated/catalog.json`과 선별된 `public/content`를 함께 전달한다. 이 둘은 자동 생성된 하나의 묶음이다. CI에서는 이 묶음의 일치를 확인하고 로컬 원본에서 다시 생성하지 않는다.

Vite의 `public`은 빌드 결과에 복사되는 영역이다. 그러므로 검수용 초안은 이 경로에 쓰지 않는다. [Vite 정적 파일 처리](https://vite.dev/guide/assets.html)

## 4. 콘텐츠 계약

### 4.1 입력: 사용자가 확정한 release

입력은 `contents/<series>/<post>/releases/<revision>/release.json`과 명시된 이미지 파일이다. 필요한 정보는 다음과 같다.

| 정보 | 의미 |
| --- | --- |
| schemaVersion | 호환 가능한 계약 버전 |
| contentId, revision | 콘텐츠와 확정 버전을 식별 |
| approval | 이 버전의 사용자 확정 시각·대상 채널 |
| kind | carousel 또는 link |
| title, summary | 공개 제목과 설명 |
| order, displayDate | 화면 배치 순서와 표시 날짜 |
| cover | 표지 파일·크기·파일 지문 |
| slides | ID·순서·PNG·지문·핵심 텍스트·사진 설명 |
| caption, sources | 확정된 캡션과 공개 출처 |
| href | 링크형 콘텐츠의 확정된 이동 주소 |

revision은 이미지 내용과 공개 문구·순서·카드 동작을 포함한 확정 묶음의 지문에 연결한다. 확인 시각과 이후 게시 응답 기록은 내용 지문에서 제외한다.

입력 형식을 검증한 뒤 다음을 대조한다.

- 사용자가 승인한 revision과 실제 파일·문구가 일치하는가.
- 승인된 게시 대상에 homepage가 있는가.
- 슬라이드 순서·수와 이미지가 모두 존재하고 디코딩 가능한가.
- 이미지의 비율·크기·파일 지문이 기록과 일치하는가.
- 사진 없는 질문 장도 이미지 한 장으로 포함되었는가.
- 링크형은 이동 가능한 주소와 표지를 가지고 있는가.

TypeScript의 타입 선언만으로 외부 JSON이 검증되었다고 간주하지 않는다. 입력을 실제로 검사하는 검증 함수를 사용한다.

### 4.2 작업 중 상태와 공개 상태

`content.json`의 `editorialStatus`는 현재 작성 중인 버전의 상태다. `approvedRevision`은 마지막으로 확정한 버전을 가리킨다.

예를 들어 v1을 게시한 뒤 v2를 수정하면 `editorialStatus`는 검수 중이어도 `approvedRevision`은 v1로 남는다. 홈페이지는 v1을 계속 사용한다. v2를 확정하면 포인터가 바뀌고 다음 배포에 v2를 사용한다.

새로운 승인본이 깨져 있으면 배포를 실패 처리하고 현재 공개 사이트를 유지한다. 초안이라는 이유로 이전 게시물을 목록에서 빼거나, 오류를 조용히 무시하고 새 버전이 올라간 것처럼 표시하지 않는다.

공개 해제는 별도 의도적인 작업으로 관리한다. 초안 수정, 폴더 접근 실패, 누락된 파일을 자동 공개 해제의 근거로 사용하지 않는다.

### 4.3 출력: 카드 목록

설계용 타입 예시:

```ts
type ImageAsset = {
  path: string;                 // 사이트 base 기준 상대 경로
  width: number;
  height: number;
  alt: string;
};

type CoverAsset = ImageAsset & {
  variants: Array<{ path: string; width: number }>;
};

type CardBase = {
  id: string;
  revision: string;
  title: string;
  cover: CoverAsset;
  displayDate: string;         // 실제 배포 확인 시각은 게시 기록에 별도 저장
};

type CarouselCard = CardBase & {
  kind: "carousel";
  slideCount: number;
  postPath: string;
};

type LinkCard = CardBase & {
  kind: "link";
  href: string;
  external: boolean;
};

type Catalog = {
  schemaVersion: "neica-catalog.v1";
  buildId: string;
  entries: Array<CarouselCard | LinkCard>;
};
```

`entries`는 생성 시 이미 정렬한다. 방문자의 현재 시각이나 임의 난수에 따라 순서를 바꾸지 않는다. 명시 order가 있는 항목부터 오름차순, 동순위는 표시일 내림차순, ID 오름차순으로 고정한다.

내부 제작 데이터의 `type`은 공개 계약의 `kind`로 변환한다. 렌더러는 두 필드를 번갈아 추측하지 않는다.

### 4.4 출력: 캐러셀 상세

```ts
type PublicSlide = {
  id: string;
  image: ImageAsset;
  text: string;                // 이미지에 있는 핵심 글의 접근 가능한 표현
};

type PublicPost = {
  schemaVersion: "neica-post.v1";
  id: string;
  revision: string;
  title: string;
  slides: [PublicSlide, ...PublicSlide[]];
  caption: {
    body: string;
    cta: string;
    hashtags: string[];
    attributions: string[];
  };
  sources: Array<{ title: string; url: string; publisher?: string }>;
};
```

목록에는 모든 슬라이드 본문과 캡션을 넣지 않는다. 캐러셀을 열 때 그 포스트의 `post.json`을 읽는다. 응답의 ID·revision이 클릭한 카드와 일치하는지 확인한다.

공개 JSON은 필요한 필드만 선택해서 생성한다. 로컬 절대 경로, data URL 편집 원본, 내부 검수 메모, 계정 인증 정보는 포함하지 않는다.

## 5. 동기화 처리

### 공개용 생성

1. 설정된 콘텐츠 루트에서 포스트 메타데이터를 읽는다.
2. 각 콘텐츠의 마지막 승인본과 홈페이지 게시 대상 여부를 확인한다.
3. 승인본 구조·내용·이미지를 검사한다.
4. 작업 임시 경로에서 원본 PNG 복사, 표지 썸네일, post.json을 생성한다.
5. 전체 공개 목록을 정렬하고 catalog.json을 생성한다.
6. 모든 참조·이미지 크기·용량을 검사한 뒤 하나의 완성 묶음으로 교체한다.

중간 실패 시 현재 공개용 묶음을 부분 수정하지 않는다. `buildId`는 같은 입력으로 같은 결과가 나오도록 공개 목록과 버전에서 계산한다.

홈페이지 원본 PNG는 승인 파일과 바이트가 동일해야 한다. 썸네일만 표지에서 파생하며 구도·텍스트·색을 임의로 바꾸지 않는다.

파일 이름은 임의 glob 정렬로 추측하지 않는다. 승인본 목록에 있는 파일만 읽는다. `output/07.png`가 남았더라도 6장짜리 승인본에 추가되지 않는다.

### 로컬 검수

- 로컬 검수는 미승인 `output`도 볼 수 있다. 출력은 `.cache/review`에 만들고 Vite 개발 모드의 전용 경로로 제공한다.
- `--mode=review`와 `--mode=publish`는 서로 다른 입력 규칙을 사용한다.
- 검수 모드에는 개발 도구 쪽에서 ‘검수용’ 상태를 표시한다. 생성된 이미지 자체에 워터마크를 넣지는 않는다.
- 공개 build는 검수 데이터 경로를 참조하면 실패하도록 검사한다.
- 출력 중간의 파일 변경을 하나씩 반영하지 않고 내보내기 완료 기록의 변경을 기준으로 읽는다.
- 같은 내용의 완료 기록은 다시 생성하지 않는다.

### 기존 콘텐츠와의 연결

현재 위치는 `public/assets/<series>/<post>`다. 폴더 이동 전에도 로컬 설정의 contentRoot로 읽을 수 있게 한다. 이 경로를 방문자 코드에 하드코딩하지 않는다.

`export.json`이 없는 기존 출력은 검수 어댑터로만 읽고 ‘출력 기록 미확인’으로 표시한다. 실제 이미지와 저장본을 대조하고 사용자가 확정하기 전에는 공개 카탈로그로 승격하지 않는다.

편집 저장본이 있으면 `neica-project.json`을 우선하는 기존 규칙을 유지한다. 이미지 수가 많거나 파일 수정 시각이 최신이라는 이유로 기준 파일을 바꾸지 않는다.

## 6. 페이지 구성과 주소 처리

다섯 HTML 파일이 각 페이지의 진입점이다. `main.tsx`는 HTML에 명시한 page ID로 해당 화면을 렌더한다. 헤더 링크는 실제 문서 주소를 사용한다.

- 개발 포트 초기안은 `127.0.0.1:4174`. 기존 편집기 `4173`과 충돌하지 않게 한다.
- 사용자 사이트의 기본 base는 `/`다. 저장소 하위 주소가 필요하면 Vite base 한곳에서 변경한다.
- 공개 데이터의 경로에는 선행 `/`를 넣지 않고 `assetUrl()`이 `import.meta.env.BASE_URL`과 결합한다.
- 외부 주소는 https, 필요한 http, 연락처의 mailto처럼 허용한 종류만 사용한다. 데이터에 들어온 HTML을 실행하지 않는다.
- `/about/`, `/labs/` 등을 실제로 빌드하며 존재하지 않는 경로에는 404 페이지를 제공한다.

캐러셀 URL은 HOME 쿼리로 관리한다.

```text
열기:         pushState("/?post=dm-01&slide=1")
슬라이드 이동: replaceState("/?post=dm-01&slide=2")
뒤로가기:     popstate → 모달 닫기
직접 링크:    쿼리 파싱 → 해당 콘텐츠 로드 → 모달 열기
```

HOME에서 만든 history entry인지 상태에 기록한다. 직접 링크로 들어온 팝업의 닫기는 HOME 주소로 replace하며 외부 history로 이동하지 않는다. 슬라이드 범위를 벗어난 숫자는 유효 범위로 정정하고, 존재하지 않는 콘텐츠는 오류 화면에서 HOME으로 돌아갈 수 있게 한다.

## 7. 뷰어 구현

### 모달

`dialog.showModal()`을 사용한다. padding·border·max-width·max-height의 기본값을 제거하고 `inset: 0`, `width: 100%`, `height: 100dvh`로 표시한다. 배경 문서의 조작 차단은 브라우저 dialog 동작을 사용한다. [MDN showModal](https://developer.mozilla.org/en-US/docs/Web/API/HTMLDialogElement/showModal)

열 때 닫기 버튼에 포커스를 두고 제목으로 라벨링한다. 닫을 때 기존 카드에 포커스를 돌려준다. Escape·close·URL 변경은 하나의 닫기 처리로 모아 두 번 history를 이동시키지 않는다. iOS에서 스크롤 잠금과 복원을 실제 확인한다.

### 상태

뷰어 상태는 `closed → loading post → loading slide → ready`, 실패 시 `error`로 전이한다. 선택한 슬라이드 ID와 현재 이미지의 로드 ID를 함께 관리한다.

- 빠르게 2→3→4장으로 이동한 뒤 2장의 다운로드가 늦게 끝나도 4장에 2장 이미지를 표시하지 않는다.
- 새 이미지의 load와 decode가 끝나고 선택 ID가 여전히 일치할 때만 ready가 된다.
- 로딩 중 현재 요청한 장 번호를 보여주며 다른 장의 이미지를 그 장인 것처럼 표시하지 않는다.
- 실패한 장에서도 이전·다음·재시도·닫기를 유지한다.
- 현재 장과 인접 1장씩 우선 준비한다. decoded 이미지 캐시는 초기 최대 5장으로 제한하고 멀어진 자원은 해제한다.

### 이미지 크기와 좌표

```text
fitScale = min(viewportWidth / imageWidth, viewportHeight / imageHeight)
displayScale = fitScale × zoom
zoom: 0.5 … 4.0, 기본 1.0
```

기본 위치는 화면 중앙이다. 확대 후 이동은 이미지가 화면에서 완전히 벗어나지 않는 범위로 제한한다. 한 축에서 이미지가 화면보다 작으면 그 축은 가운데 고정한다. 화면 회전·창 크기 변경 시 fitScale과 이동 한계를 다시 계산한다.

버튼 확대는 화면 중앙, 핀치는 두 손가락의 중심을 기준으로 처리한다. 좌표 갱신은 animation frame에 묶어 과도한 React 렌더를 피한다. 배율·슬라이드 같은 의미 있는 상태는 React가 관리한다.

### 제스처 충돌 방지

- 포인터 1개, zoom ≤ 1: 가로 방향 이동량이 임계값을 넘을 때 한 장 이동.
- 포인터 1개, zoom > 1: 이미지 pan. 끝에서 자동으로 다음 장을 열지 않는다.
- 포인터 2개: pinch. 두 손가락 중심과 거리를 함께 사용한다.
- pointercancel·포커스 상실·닫기 시 활성 포인터를 모두 정리한다.
- 핀치를 했던 접촉 묶음은 마지막 손가락이 떨어질 때까지 스와이프로 전환하지 않는다.
- touch-action 제한은 뷰어 이미지 조작 영역에만 적용한다. HOME과 소개 페이지의 기본 스크롤·확대를 막지 않는다.
- 브라우저 페이지 확대 단축키는 유지하고, 일반 `+ / - / 0`만 뷰어가 열렸을 때 처리한다.

Pointer Events의 취소 이벤트와 touch-action을 함께 고려한다. [MDN 제스처 처리](https://developer.mozilla.org/en-US/docs/Web/API/Pointer_events/Pinch_zoom_gestures), [MDN touch-action](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/touch-action)

## 8. 스타일·접근성·성능

### 토큰

```css
:root {
  --font-body: -apple-system, BlinkMacSystemFont, system-ui, sans-serif;
  --font-mono: ui-monospace, "SFMono-Regular", Menlo, Consolas, monospace;
  --color-background: #fff;
  --color-text: #111;
  --color-muted: #666;
  --color-viewer: #111;
  --page-max-width: 1440px;
  --grid-column-gap: 48px;
  --grid-row-gap: 80px;
}
```

본문은 `word-break: keep-all`을 기본으로 하고 필요한 긴 주소에는 별도 줄바꿈 규칙을 적용한다. 사용자가 보는 본문과 메뉴에 내부 데이터 이름을 노출하지 않는다.

이미지의 alt에는 사진 설명을, 별도 접근 가능한 텍스트에는 제목·본문을 둔다. 같은 긴 본문을 alt와 설명에 중복해서 읽히지 않게 한다. 핵심 내용은 요청 시 펼치는 정보 영역에서도 읽을 수 있다.

방향 버튼의 이름, 현재 장의 짧은 안내, focus-visible, 44px 조작 영역을 제공한다. reduced-motion 환경에서는 전환 효과를 끈다.

### 로딩 계획

- 첫 줄의 표지부터 로드하고 화면 아래 이미지는 lazy loading한다.
- 표지 썸네일은 540px와 1080px 너비를 생성하고 srcset/sizes로 선택한다.
- 캐러셀을 열기 전에는 전체 포스트의 PNG를 다운로드하지 않는다.
- 원본 PNG는 글자 선명도를 유지하고 표지 썸네일의 한글 가독성을 시각 검수한다.
- image width/height와 aspect-ratio로 레이아웃 이동을 줄인다.
- 첫 화면 압축 JS 180KB 이하, 표지 1장 200KB 내외를 초기 목표로 둔다. 실제 글자 품질을 해치면서 용량 목표를 강제하지 않는다.
- 첫 버전에는 서비스워커나 오래 유지하는 브라우저 데이터 저장을 도입하지 않는다.

### 캐시와 배포 경계

이미지와 post.json의 URL에 contentId와 revision을 포함한다. 표지와 본문은 같은 revision에서 나온다. 작은 카탈로그는 빌드에 포함되어 JS 버전과 함께 바뀐다.

현재 열려 있는 탭은 기존 목록을 계속 사용한다. 이전 revision 자산은 최소 직전 배포분까지 함께 유지하여 배포 직후의 읽기 실패를 줄인다. 그보다 오래 열린 탭에서 파일이 사라지면 새로고침 안내를 제공한다.

## 9. 실행·배포 계획

구현할 명령의 책임:

| 명령 | 역할 |
| --- | --- |
| `npm run dev` | 준비된 공개 데이터로 로컬 홈페이지 실행 |
| `npm run dev:review` | 로컬 초안·내보내기를 검수용으로 표시 |
| `npm run content:sync` | 사용자 확정본을 공개 묶음으로 생성 |
| `npm run content:check` | 전달된 공개 묶음의 구조·참조·지문 확인 |
| `npm run build` | 검사 → 타입 확인 → 정적 빌드 → 결과 검사 |
| `npm run preview` | 빌드된 공개 화면 확인 |

명령 인자 또는 로컬 설정으로 콘텐츠 루트와 게시 작업 경로를 지정한다. 현재 프로젝트 폴더명을 앱 코드에 넣지 않는다.

### GitHub

홈페이지 저장소의 루트는 배포할 homepage 패키지다. 로컬 프로젝트 전체를 그 저장소의 공개 파일로 삼지 않는다. 실제 Git 체크아웃 경로는 게시 도구가 관리하며, 현재 루트 Git 안에 중첩 저장소를 임의로 만들지 않는다.

업로드 묶음은 홈페이지 소스·설정·lockfile·공개 카탈로그·승인된 PNG·썸네일이다. `planner`, 원본 `images`, 편집 JSON, 검수 캐시는 포함하지 않는다.

Actions는 `npm ci → content 검사 → 타입 확인·빌드 → dist 검사 → Pages artifact 업로드 → 배포`를 수행한다. 배포 작업은 중첩 실행하지 않도록 직렬화한다. 실패한 빌드로 기존 사이트를 교체하지 않는다. [GitHub Pages 워크플로](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages)

배포 결과의 성공 상태와 사이트 버전 표시 파일의 buildId를 확인한 뒤 홈페이지 게시 완료를 기록한다. 인스타그램의 완료 상태는 이 결과로 대신하지 않는다.

GitHub Pages는 공개 사이트 크기 1GB, 월 대역폭 soft limit 100GB 등의 한도가 있다. 이미지가 중심인 사이트이므로 빌드 결과 크기를 기록하고, 배포 크기 750MB에서 보관·이미지 전달 방식을 검토한다. 첫 버전에는 외부 이미지 저장 서비스를 추가하지 않는다. [GitHub Pages 한도](https://docs.github.com/en/pages/getting-started-with-github-pages/github-pages-limits)

### 검색·공유 범위

5개 정적 HTML에 페이지별 title·description·언어·사이트 공통 OG 정보를 둔다. 첫 버전의 `?post=` 링크는 작동하지만 포스트마다 별도 OG 이미지를 생성하지는 않는다. 포스트별 검색 노출과 공유 카드가 필요해지면 정적 상세 HTML을 생성하는 단계로 확장한다.

## 10. 구현 단계

1. **홈페이지 패키지·스타일** — 기존 편집기와 독립된 위치에 기본 페이지와 토큰을 만든다.
2. **콘텐츠 계약·검수 어댑터** — 현재 output을 로컬에서 확인하고 승인본 입력 형식을 정의한다.
3. **HOME** — 실제 표지, 반응형 그리드, 링크형 동작을 연결한다.
4. **뷰어** — 로드 처리부터 구현하고 이동, URL, 확대·제스처 순서로 추가한다.
5. **확정본 동기화** — 원본 검증, 공개 묶음, 썸네일, 목록 생성과 초안 제외를 연결한다.
6. **보조 페이지** — 실제 브랜드 문구와 확인된 공식 링크를 넣는다.
7. **배포** — 새 계정 저장소와 Actions를 연결하고 실제 주소에서 검증한다.

홈페이지의 로컬 제작은 기존 다섯 폴더 이동을 먼저 모두 끝내지 않아도 시작할 수 있다. 콘텐츠 루트를 설정으로 받기 때문에 폴더 이동은 별도 검증 후 적용한다.

## 11. 검증 시나리오

| 검증 | 기대 결과 |
| --- | --- |
| 미승인 output이 생김 | 로컬 검수에는 보이며 공개 목록에는 없음 |
| v1 게시 후 v2 작성 중 | 홈페이지의 v1 유지 |
| 승인 이미지·문구가 바뀜 | 내용 불일치로 새 배포 차단, 기존 사이트 유지 |
| 8장 → 6장 확정 | 6장만 공개; 남은 옛 PNG 무시 |
| 승인 파일 누락·손상 | 조용한 누락 없이 빌드 실패 |
| 두 슬라이드 PNG가 의도치 않게 동일 | 중복 결과 경고와 확인; 자동으로 슬라이드 삭제하지 않음 |
| 2→3→4장 빠르게 넘김 | 늦게 도착한 2장 응답이 4장을 덮지 않음 |
| 마지막 질문 장 | 사진 없어도 PNG와 중앙 질문 표시 |
| 확대 후 드래그·핀치 종료 | 장이 의도치 않게 넘어가지 않음 |
| 닫기·Escape·뒤로가기 | 원래 카드 위치와 포커스 복원 |
| 직접 공유 URL | 해당 포스트·장 열림, 닫기는 HOME |
| 320px·390px·768px·1440px | 그리드·메뉴·터치 조작 확인 |
| `/about/` 직접 접근·새로고침 | 공개 서버에서도 정상 |
| 사이트 하위 base로 빌드 | 이미지·메뉴·상세 JSON 경로 정상 |
| 게시 중 한 채널 실패 | 성공 채널을 중복 게시하지 않고 별도로 기록 |

타입/데이터 검사는 자동화한다. 실제 레이아웃·한글 선명도·iOS 스크롤과 핀치는 브라우저에서 확인한다. 작은 가역적 스타일 수정에 불필요한 테스트를 추가하기보다 출력 일치·버전·내비게이션·제스처에 검증을 집중한다.
