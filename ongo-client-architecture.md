# 온고지식(On-go 지식) — 클라이언트 아키텍처 설계서

## 1. 아키텍처 개요

Turborepo 기반 모노레포 + React Native(Expo)를 활용하여 iOS, Android, Web을 단일 코드베이스로 지원하며, 향후 관리자 웹 대시보드, 디자인 시스템 문서 사이트 등 확장을 고려한 구조입니다.

---

## 2. 모노레포 디렉토리 구조

```
ongo-jishik/
├── .github/
│   └── workflows/
│       ├── ci.yml                    # PR 단위 lint·type-check·test
│       ├── preview.yml               # EAS Update preview 배포
│       └── production.yml            # EAS Build production 배포
│
├── apps/
│   ├── mobile/                       # Expo Router 기반 모바일 앱 (iOS + Android)
│   │   ├── app/                      # 파일 기반 라우팅 (Expo Router)
│   │   │   ├── (tabs)/              # 탭 내비게이션 레이아웃
│   │   │   │   ├── _layout.tsx      # Tab Navigator 정의
│   │   │   │   ├── index.tsx        # 홈 화면
│   │   │   │   ├── search.tsx       # 검색 화면
│   │   │   │   ├── history.tsx      # 역사 탐색 화면
│   │   │   │   ├── community.tsx    # 커뮤니티 피드
│   │   │   │   └── mypage.tsx       # 마이페이지
│   │   │   ├── food/
│   │   │   │   └── [id].tsx         # 음식 상세 화면 (탭: 조리법/식재료/역사/문헌)
│   │   │   ├── search/
│   │   │   │   └── results.tsx      # 검색 결과 화면
│   │   │   ├── community/
│   │   │   │   ├── [postId].tsx     # 게시글 상세
│   │   │   │   └── write.tsx        # 게시글 작성
│   │   │   ├── favorites.tsx        # 즐겨찾기 목록
│   │   │   ├── my-posts.tsx         # 내 게시글 목록
│   │   │   ├── settings/
│   │   │   │   ├── language.tsx     # 언어 설정
│   │   │   │   └── notifications.tsx
│   │   │   └── _layout.tsx          # Root Layout (Provider 래핑)
│   │   ├── app.config.ts            # Expo 동적 설정
│   │   ├── eas.json                 # EAS Build 프로필
│   │   ├── tsconfig.json
│   │   └── package.json
│   │
│   └── web-admin/                   # (향후) Next.js 관리자 대시보드
│       └── ...
│
├── packages/
│   ├── ui/                          # 공유 UI 컴포넌트 라이브러리
│   │   ├── src/
│   │   │   ├── primitives/          # 기본 단위 컴포넌트
│   │   │   │   ├── Text.tsx
│   │   │   │   ├── Button.tsx
│   │   │   │   ├── Input.tsx
│   │   │   │   ├── Card.tsx
│   │   │   │   ├── Badge.tsx
│   │   │   │   ├── Avatar.tsx
│   │   │   │   ├── Chip.tsx
│   │   │   │   └── Icon.tsx
│   │   │   ├── composites/          # 조합 컴포넌트
│   │   │   │   ├── SearchBar.tsx         # 검색 바 (음성 입력 버튼 포함)
│   │   │   │   ├── FoodCard.tsx          # 음식 카드 (이미지+이름+설명+좋아요)
│   │   │   │   ├── FoodResultCard.tsx    # 검색 결과 카드 (가로 레이아웃)
│   │   │   │   ├── FeaturedCard.tsx      # 오늘의 추천 카드
│   │   │   │   ├── PopularFoods.tsx      # 인기 전통 음식 섹션 (가로 스크롤)
│   │   │   │   ├── AIAnalysisBadge.tsx   # AI 분석 결과 표시 (검색 결과 화면)
│   │   │   │   ├── RecipeStep.tsx        # 조리법 단계 표시 (번호+연결선)
│   │   │   │   ├── HistorySection.tsx    # 역사 이야기 섹션 (유래/문헌/의례)
│   │   │   │   ├── LiteratureQuote.tsx   # 문헌 인용 블록 (왼쪽 바+인용문)
│   │   │   │   ├── PostCard.tsx          # 커뮤니티 게시글 카드
│   │   │   │   ├── PostDetail.tsx        # 게시글 상세 (사진갤러리+본문)
│   │   │   │   ├── PhotoGallery.tsx      # 사진 갤러리 (스와이프+페이지 인디케이터)
│   │   │   │   ├── RecipeLink.tsx        # 레시피 연결 링크 (게시글 내)
│   │   │   │   ├── CommentInput.tsx      # 댓글 입력 (입력창+전송버튼)
│   │   │   │   ├── TabBar.tsx            # 상세 화면 탭 바
│   │   │   │   ├── DataSourceTag.tsx     # 출처 표시 태그
│   │   │   │   ├── FeedbackButtons.tsx   # 👍👎 피드백 버튼 (역사/문헌 탭 하단)
│   │   │   │   └── MenuItem.tsx          # 마이페이지 메뉴 아이템 (아이콘+제목+설명)
│   │   │   ├── layouts/              # 레이아웃 컴포넌트
│   │   │   │   ├── ScreenLayout.tsx
│   │   │   │   ├── Header.tsx
│   │   │   │   └── BottomNav.tsx
│   │   │   └── index.ts
│   │   ├── tokens/                   # 디자인 토큰
│   │   │   ├── colors.ts            # 색상 팔레트 (한국 전통색 기반)
│   │   │   ├── typography.ts        # 폰트 패밀리·크기·행간
│   │   │   ├── spacing.ts           # 간격 스케일
│   │   │   ├── radius.ts            # 라운딩 값
│   │   │   └── shadows.ts
│   │   ├── theme/
│   │   │   ├── ThemeProvider.tsx
│   │   │   ├── light.ts
│   │   │   ├── dark.ts
│   │   │   └── useTheme.ts
│   │   ├── tsconfig.json
│   │   └── package.json
│   │
│   ├── api-client/                  # API 통신 계층
│   │   ├── src/
│   │   │   ├── client.ts            # Axios/Ky 인스턴스, 인터셉터
│   │   │   ├── endpoints/
│   │   │   │   ├── food.ts          # 음식 검색/추천/상세
│   │   │   │   ├── history.ts       # 역사 스토리텔링
│   │   │   │   ├── community.ts     # 게시글 CRUD
│   │   │   │   ├── auth.ts          # OAuth 인증
│   │   │   │   ├── user.ts          # 유저 프로필/즐겨찾기
│   │   │   │   └── market.ts        # 전통시장 연계
│   │   │   ├── hooks/               # TanStack Query 기반 커스텀 훅
│   │   │   │   ├── useSearch.ts
│   │   │   │   ├── useFoodDetail.ts
│   │   │   │   ├── useRecommendation.ts
│   │   │   │   ├── useCommunity.ts
│   │   │   │   ├── useFavorites.ts
│   │   │   └── types/               # API 응답/요청 타입
│   │   │       ├── food.ts
│   │   │       ├── search.ts
│   │   │       ├── community.ts
│   │   │       └── common.ts
│   │   ├── tsconfig.json
│   │   └── package.json
│   │
│   ├── store/                       # 전역 상태 관리 (Jotai)
│   │   ├── src/
│   │   │   ├── atoms/
│   │   │   │   ├── authAtom.ts      # 인증 상태
│   │   │   │   ├── searchAtom.ts    # 검색 히스토리, 필터 상태
│   │   │   │   ├── languageAtom.ts  # 다국어 설정
│   │   │   │   ├── favoriteAtom.ts  # 즐겨찾기 로컬 캐시
│   │   │   │   └── uiAtom.ts       # UI 상태 (탭, 모달 등)
│   │   │   ├── derived/             # 파생 atom (읽기 전용 조합)
│   │   │   │   ├── currentUserAtom.ts
│   │   │   │   └── recentSearchAtom.ts
│   │   │   └── index.ts
│   │   ├── tsconfig.json
│   │   └── package.json
│   │
│   ├── i18n/                        # 다국어 리소스
│   │   ├── src/
│   │   │   ├── config.ts            # i18next 초기화
│   │   │   ├── locales/
│   │   │   │   ├── ko.json          # 한국어
│   │   │   │   ├── en.json          # 영어
│   │   │   │   ├── ja.json          # 일본어
│   │   │   │   └── zh.json          # 중국어(간체)
│   │   │   └── useTranslation.ts
│   │   ├── tsconfig.json
│   │   └── package.json
│   │
│   ├── utils/                       # 공유 유틸리티
│   │   ├── src/
│   │   │   ├── formatters.ts        # 날짜, 숫자 포맷
│   │   │   ├── validators.ts        # 입력 검증
│   │   │   ├── foodCategories.ts    # 카테고리 상수 (떡류, 국/탕 등)
│   │   │   ├── storage.ts           # AsyncStorage 래퍼
│   │   │   └── analytics.ts         # 이벤트 트래킹
│   │   ├── tsconfig.json
│   │   └── package.json
│   │
│   └── typescript-config/           # 공유 tsconfig
│       ├── base.json
│       ├── react-native.json
│       └── nextjs.json
│
├── turbo.json                       # Turborepo 파이프라인 설정
├── package.json                     # 워크스페이스 루트
├── pnpm-workspace.yaml
└── .eslintrc.js
```

---

## 3. 화면-컴포넌트 매핑 (Figma 기반)

Figma 와이어프레임에서 도출한 13개 화면과 각 화면에 사용되는 컴포넌트 구성입니다.

### 3.1 홈 화면 (`(tabs)/index.tsx`)

```
┌─ Header ─────────────────────────────┐
│  🍚 온고지식              🔔          │
├─ SearchBar ──────────────────────────┤
│  🔍 어떤 전통 음식이 궁금하세요?  🎤  │
├─ FeaturedCard ───────────────────────┤
│  오늘의 추천 전통 음식     더보기 →    │
│  구절판 (九節板)  [궁중 요리]         │
│  "아홉 가지 재료를 담은 궁중 요리"    │
├─ PopularFoods (FoodCard × N 가로) ──┤
│  [신선로] [만두] [약과] [송편] →      │
├─ BottomNav ──────────────────────────┤
│  🏠홈  🔍검색  📖역사  💬커뮤니티  👤마이│
└──────────────────────────────────────┘
```

### 3.2 검색 화면 (`(tabs)/search.tsx`)

```
┌─ Header (← 검색) ───────────────────┐
├─ SearchBar (active, 입력 중) ────────┤
│  🔍 매콤하고 빨간 국물 요리      ✕   │
├─ 최근 검색어 리스트 ─────────────────┤
│  최근 검색어              전체삭제    │
│  🕐 설날에 먹는 음식              ✕   │
│  🕐 궁중 요리 추천                ✕   │
│  🕐 I saw a colorful layered ...  ✕   │
│  🕐 お正月に食べる料理            ✕   │
│  🕐 손님 올 때 격식 있는 상차림    ✕   │
├─ BottomNav ──────────────────────────┤
└──────────────────────────────────────┘
```

### 3.3 검색 결과 화면 (`search/results.tsx`)

```
┌─ Header (← 검색 결과) ──────────────┐
├─ Query Bar ──────────────────────────┤
│  🔍 "매콤하고 빨간 국물 요리"        │
├─ Sort Filter (결과 수) ─────────────┤
│  3개 결과                            │
├─ AIAnalysisBadge ────────────────────┤
│  🤖 AI 분석 결과                     │
│  맛: 매운맛 · 색: 빨강 · 형태: 국/탕  │
│  3개의 전통 음식을 찾았습니다         │
├─ FoodResultCard × N ─────────────────┤
│  ┌────┬──────────────────────┐       │
│  │ 🍲 │ 육개장 Yukgaejang     │       │
│  │    │ [국/탕류] 매콤한 소고기│       │
│  │    │ 국물에 고사리...   →  │       │
│  └────┴──────────────────────┘       │
├─ DataSourceTag ──────────────────────┤
│  📋 출처: 특허청 한국전통지식포탈      │
├─ BottomNav ──────────────────────────┤
└──────────────────────────────────────┘
```

### 3.4 음식 상세 화면 — 조리법 탭 (`food/[id].tsx`)

```
┌─ Hero Image ─────────────────────────┐
│  [←]       🍲 (연출 이미지)     [♡]  │
│  ※ 사용자 이해를 돕기 위한 연출 이미지│
├─ Food Info ──────────────────────────┤
│  육개장                              │
│  Yukgaejang · 肉개醬                 │
│  [국/탕류] [매운맛] [보양식] [소고기]  │
│  출처: 특허청 전통지식포탈             │
├─ TabBar ─────────────────────────────┤
│  [조리법] │ 식재료 │ 역사이야기 │ 문헌│
├─ Recipe Content ─────────────────────┤
│  조리법                              │
│  📖 산림경제 기반 전통 조리법          │
│  ①─ 재료 준비                        │
│  │  소고기(양지) 300g, 고사리 100g... │
│  ②─ 소고기 삶기                      │
│  │  소고기를 찬물에 넣고 충분히 삶아...│
│  ③─ 양념 볶기                        │
│  │  고춧가루, 간장, 다진 마늘...      │
│  ④  끓이기                           │
│     육수를 붓고 센 불에서 끓인 후...   │
├─ Bottom Action ──────────────────────┤
│  [♡]  [📋 재료 구매처 보기 (전통시장)]│
└──────────────────────────────────────┘
```

### 3.5 음식 상세 화면 — 역사 이야기 탭 (`food/[id].tsx`, 탭 전환)

```
┌─ Header (← 육개장          ♡) ──────┐
├─ TabBar ─────────────────────────────┤
│  조리법 │ 식재료 │ [역사이야기] │ 문헌│
├─ History Content ────────────────────┤
│  📜 유래 이야기                      │
│  육개장은 본래 조선시대 궁중에서      │
│  여름철 보양식으로 즐겨 먹던 음식...  │
│                                      │
│  📚 문헌 기록                        │
│  ┌─────────────────────────────┐    │
│  │"산림경제(山林經濟)에 기록된    │    │
│  │ 개장국(개醬國)의 조리법..."    │    │
│  └─────────────────────────────┘    │
│  출전: 산림경제·홍만선·1715년경       │
│                        원문 보기 →   │
│                                      │
│  🎎 의례와의 연결                    │
│  복날 보양식, 제사 음식으로도...      │
├─ Bottom Feedback ────────────────────┤
│  이 역사 정보가 도움이 되었나요? 👍👎│
└──────────────────────────────────────┘
```

### 3.6 음식 상세 화면 — 문헌 원문 탭 (`food/[id].tsx`, 탭 전환)

역사 이야기 탭과 동일 구조, 탭 선택만 "문헌"으로 변경.
하단에 동일하게 피드백 버튼(👍👎) 표시.

### 3.7 커뮤니티 화면 (`(tabs)/community.tsx`)

```
┌─ Header (커뮤니티           ✏️) ─────┐
├─ Filter Tabs ────────────────────────┤
│  [전체] [조리 후기] [나만의 레시피] [Q&A]│
├─ PostCard × N ───────────────────────┤
│  전통요리사_하나 · 2시간 전           │
│  [사진 영역]                          │
│  📋 육개장 레시피                     │
│  "할머니 레시피로 만든 육개장! ..."    │
│  ❤️128  💬23  ↗공유                  │
├─ BottomNav ──────────────────────────┤
└──────────────────────────────────────┘
```

### 3.8 게시글 상세 (`community/[postId].tsx`)

```
┌─ Header (← 게시글           ⋯) ─────┐
├─ Author ─────────────────────────────┤
│  전통요리사_하나                      │
│  2시간 전 · 조리 후기                 │
├─ PhotoGallery (스와이프) ────────────┤
│           🍲                         │
│                              1/3     │
├─ Engagement ─────────────────────────┤
│  ❤️ 128   💬 23                      │
├─ Post Content ───────────────────────┤
│  할머니 레시피로 만든 육개장! 🥰      │
│  고사리를 듬뿍 넣으니 진짜 옛날 맛... │
├─ RecipeLink ─────────────────────────┤
│  🍲 육개장 레시피 보기            →   │
│     산림경제 기반 전통 조리법 · 4단계  │
├─ Comments Preview ───────────────────┤
│  💬 댓글 23개                        │
├─ CommentInput ───────────────────────┤
│  [댓글을 입력하세요...]         [↑]   │
└──────────────────────────────────────┘
```

### 3.9 게시글 작성 (`community/write.tsx`)

```
┌─ Header (✕  게시글 작성  [등록]) ────┐
├─ Category Selector ──────────────────┤
│  [조리 후기] [나만의 레시피] [질문/답변]│
├─ Recipe Tag ─────────────────────────┤
│  📋 레시피 태그                      │
│  사용한 레시피를 연결하세요  [🍲 육개장 ✕]│
├─ Photo Upload ───────────────────────┤
│  사진  최대 5장                       │
│  [📷추가] [사진1 ✕] [사진2 ✕]        │
├─ Text Input ─────────────────────────┤
│  (본문 입력 영역)        124 / 1000   │
└──────────────────────────────────────┘
```

### 3.10 마이페이지 (`(tabs)/mypage.tsx`)

```
┌─ 마이페이지 ─────────────────────────┐
├─ Profile ────────────────────────────┤
│  전통요리사_하나                      │
│  hana@gmail.com                      │
│  한국어 · 가입일 2024.03              │
├─ Stats (가로 4열) ───────────────────┤
│  12     │ 5      │ 28     │ 3       │
│  즐겨찾기│ 내게시글│ 검색기록│ 도전기록│
├─ MenuItem × 3 ───────────────────────┤
│  ♡ 즐겨찾기 목록                      │
│     저장한 전통 음식 12개          →  │
│  🕐 검색 기록                         │
│     최근 검색어 및 결과            →  │
│  📝 내 게시글                         │
│     조리 후기 및 레시피 5개        →  │
├─ 설정 ──────────────────────────────┤
│  🌐 언어 설정       한국어  →        │
│  🔔 알림 설정       켜짐    →        │
│  ℹ️ 앱 정보        v1.0.0  →        │
├─ BottomNav ──────────────────────────┤
└──────────────────────────────────────┘
```

### 3.11 즐겨찾기 목록 화면 (`favorites.tsx`)

```
┌─ Header (← 즐겨찾기 목록) ──────────┐
├─ FoodResultCard × N ─────────────────┤
│  (검색 결과 카드와 동일 레이아웃)      │
├─ BottomNav ──────────────────────────┤
└──────────────────────────────────────┘
```

### 3.12 내 게시글 화면 (`my-posts.tsx`)

```
┌─ Header (커뮤니티           ✏️) ─────┐
├─ Filter Tabs ────────────────────────┤
│  [전체] [조리 후기] [나만의 레시피] [Q&A]│
├─ PostCard × N (내 게시글만) ─────────┤
├─ BottomNav ──────────────────────────┤
└──────────────────────────────────────┘
```

---

## 4. 핵심 기술 스택

| 계층 | 기술 | 선정 근거 |
|------|------|---------|
| **모노레포** | Turborepo + pnpm | 빌드 캐싱, 의존성 관리, 태스크 파이프라인 |
| **앱 프레임워크** | Expo SDK 52+ (Managed) | OTA 업데이트, 네이티브 모듈 관리, EAS 빌드/배포 |
| **라우팅** | Expo Router v4 (파일 기반) | Deep Link 자동 설정, 타입 안전, 웹 호환 |
| **스타일링** | Nativewind v4 (Tailwind) | 웹/네이티브 동일 문법, 빠른 개발, 디자인 토큰 매핑 |
| **상태 관리** | Jotai | 원자적 상태 모델, React 동시성 호환, 파생 상태 용이 |
| **서버 상태** | TanStack Query v5 | 캐싱, 낙관적 업데이트, 무한 스크롤, 오프라인 |
| **다국어** | i18next + react-i18next | 런타임 언어 전환, ICU 포맷, 네임스페이스 분리 |
| **인증** | expo-auth-session (Google OAuth) | Expo 네이티브 OAuth 플로우 |
| **이미지** | expo-image (blurhash 지원) | 성능 최적화, 캐싱, 프로그레시브 로딩 |
| **애니메이션** | react-native-reanimated v3 | 네이티브 스레드 실행, 제스처 연동 |
| **폼 관리** | react-hook-form + zod | 성능, 타입 안전 검증 |
| **테스트** | Vitest + React Native Testing Library | 빠른 유닛/통합 테스트 |
| **E2E** | Maestro | 모바일 특화 E2E, YAML 기반 시나리오 |

---

## 5. Turborepo 파이프라인 설정

```jsonc
// turbo.json
{
  "$schema": "https://turbo.build/schema.json",
  "globalDependencies": ["**/.env.*local"],
  "pipeline": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": ["dist/**", ".next/**", ".expo/**"]
    },
    "lint": {
      "dependsOn": ["^build"]
    },
    "typecheck": {
      "dependsOn": ["^build"]
    },
    "test": {
      "dependsOn": ["^build"]
    },
    "dev": {
      "cache": false,
      "persistent": true
    }
  }
}
```

---

## 6. 패키지 의존성 그래프

```
apps/mobile
  ├── @ongo/ui              (UI 컴포넌트)
  ├── @ongo/api-client       (API 통신 + 훅)
  ├── @ongo/store            (전역 상태)
  ├── @ongo/i18n             (다국어)
  ├── @ongo/utils            (유틸리티)
  └── @ongo/typescript-config

packages/ui
  ├── @ongo/utils
  └── @ongo/typescript-config

packages/api-client
  ├── @ongo/utils
  └── @ongo/typescript-config

packages/store
  ├── @ongo/api-client
  └── @ongo/typescript-config

packages/i18n
  └── @ongo/typescript-config
```

---

## 7. 내비게이션 구조

Expo Router 파일 기반 라우팅으로, Figma 와이어프레임의 13개 화면을 반영합니다.

```
app/
├── _layout.tsx              ← Root: Provider 주입 (Theme, Query, i18n, Auth)
├── (tabs)/
│   ├── _layout.tsx          ← Tab Navigator (5탭: 홈/검색/역사/커뮤니티/마이)
│   ├── index.tsx            ← 🏠 홈
│   ├── search.tsx           ← 🔍 검색 (입력 + 최근 검색어)
│   ├── history.tsx          ← 📖 역사 탐색
│   ├── community.tsx        ← 💬 커뮤니티 피드
│   └── mypage.tsx           ← 👤 마이페이지
├── food/
│   └── [id].tsx             ← 음식 상세 (조리법/식재료/역사/문헌 탭)
├── search/
│   └── results.tsx          ← 검색 결과 (AI 분석 + 결과 카드)
├── community/
│   ├── [postId].tsx         ← 게시글 상세 (사진갤러리 + 댓글)
│   └── write.tsx            ← 게시글 작성 (Modal)
├── favorites.tsx            ← 즐겨찾기 목록 (마이페이지에서 진입)
├── my-posts.tsx             ← 내 게시글 목록 (마이페이지에서 진입)
├── settings/
│   ├── language.tsx
│   └── notifications.tsx
└── (auth)/
    └── login.tsx            ← 로그인 (Google OAuth)
```

**상세 화면 탭 구성 (Figma TabBar 컴포넌트 기반):**

| 순서 | 탭 라벨 | 내용 | 하단 영역 |
|------|--------|------|---------|
| 1 | 조리법 | 단계별 조리 과정 (RecipeStep) | 재료 구매처 보기 |
| 2 | 식재료 | 필요 재료 목록 | 재료 구매처 보기 |
| 3 | 역사이야기 | 유래/문헌기록/의례 (HistorySection) | 피드백 👍👎 |
| 4 | 문헌 | 출전 문헌 원문 | 피드백 👍👎 |

**Bottom Navigation (5탭):**

| 순서 | 아이콘 | 라벨 | 경로 |
|------|--------|------|------|
| 1 | 🏠 | 홈 | `/(tabs)` |
| 2 | 🔍 | 검색 | `/(tabs)/search` |
| 3 | 📖 | 역사 | `/(tabs)/history` |
| 4 | 💬 | 커뮤니티 | `/(tabs)/community` |
| 5 | 👤 | 마이 | `/(tabs)/mypage` |

---

## 8. 데이터 흐름 아키텍처

```
┌─────────────────────────────────────────────┐
│                  UI Layer                    │
│        (Expo Router Screens + @ongo/ui)      │
└──────────────┬──────────────────────────────┘
               │ hooks 호출
┌──────────────▼──────────────────────────────┐
│           @ongo/api-client                   │
│  ┌────────────────┐  ┌───────────────────┐  │
│  │ TanStack Query  │  │ Jotai Atoms       │  │
│  │ (서버 상태)     │  │ (클라이언트 상태) │  │
│  │ - 캐시          │  │ - 인증 토큰       │  │
│  │ - 리페치        │  │ - 검색 히스토리   │  │
│  │ - 낙관적 업데이트│  │ - 언어 설정       │  │
│  │ - 무한 스크롤   │  │ - UI 상태         │  │
│  └───────┬────────┘  └───────────────────┘  │
│          │                                   │
│  ┌───────▼────────┐                          │
│  │ API Client      │                          │
│  │ (Axios/Ky)      │                          │
│  │ - 인터셉터       │                          │
│  │ - 토큰 갱신      │                          │
│  │ - 에러 핸들링    │                          │
│  └───────┬────────┘                          │
└──────────│──────────────────────────────────┘
           │ HTTPS
┌──────────▼──────────────────────────────────┐
│            Backend (FastAPI)                  │
│  ┌─────────┐ ┌─────────┐ ┌──────────────┐  │
│  │ RAG 추천 │ │ 스토리  │ │ 전통지식포탈 │  │
│  │ 엔진    │ │ 생성    │ │ API Proxy   │  │
│  └─────────┘ └─────────┘ └──────────────┘  │
└─────────────────────────────────────────────┘
```

### 핵심 Query Key 설계

```typescript
// @ongo/api-client/hooks

// 음식 추천/검색
queryKey: ['food', 'search', { query, filters }]
queryKey: ['food', 'detail', foodId]
queryKey: ['food', 'recommendation', 'today']
queryKey: ['food', 'popular']

// 역사 스토리텔링
queryKey: ['history', foodId]
queryKey: ['literature', foodId, sourceId]

// 커뮤니티
queryKey: ['community', 'feed', { category, page }]
queryKey: ['community', 'post', postId]
queryKey: ['community', 'comments', postId]

// 사용자
queryKey: ['user', 'profile']
queryKey: ['user', 'favorites']
queryKey: ['user', 'searchHistory']
queryKey: ['user', 'posts']
```

---

## 9. 다국어 아키텍처

기획서의 다국어 요구사항을 반영한 i18n 설계입니다.

```typescript
// packages/i18n/src/config.ts
import i18next from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  ko: { translation: require('./locales/ko.json') },
  en: { translation: require('./locales/en.json') },
  ja: { translation: require('./locales/ja.json') },
  zh: { translation: require('./locales/zh.json') },
};

i18next.use(initReactI18next).init({
  resources,
  lng: 'ko',
  fallbackLng: 'ko',
  interpolation: { escapeValue: false },
});
```

**네임스페이스 구조 예시 (ko.json):**

```jsonc
{
  "tabs": {
    "home": "홈",
    "search": "검색",
    "history": "역사",
    "community": "커뮤니티",
    "mypage": "마이"
  },
  "home": {
    "todayRecommendation": "오늘의 추천",
    "popularFoods": "인기 전통 음식",
    "categoryExplore": "카테고리 탐색",
    "searchPlaceholder": "어떤 전통 음식이 궁금하세요?"
  },
  "detail": {
    "recipe": "조리법",
    "ingredients": "식재료",
    "historyStory": "역사 이야기",
    "literature": "문헌 원문",
    "health": "건강 정보",
    "aiImageDisclaimer": "사용자 이해를 돕기 위한 연출 이미지입니다",
    "dataSource": "출처: 특허청 한국전통지식포탈"
  }
}
```

**음식 이름은 항상 한국어 병기** (기획서 요구사항): API 응답에 `nameKo` + `nameLocalized` 포함, UI에서 `{nameLocalized} ({nameKo})` 형태로 표시.

---

## 10. 오프라인 & 캐싱 전략

| 데이터 | 캐시 전략 | 만료 시간 |
|--------|---------|---------|
| 오늘의 추천 | staleTime: 1h | gcTime: 24h |
| 음식 상세 | staleTime: 24h | gcTime: 7d |
| 검색 결과 | staleTime: 5m | gcTime: 1h |
| 역사 스토리 | staleTime: 7d | gcTime: 30d |
| 커뮤니티 피드 | staleTime: 30s | gcTime: 5m |
| 사용자 프로필 | staleTime: 5m | gcTime: 1h |

오프라인 지원은 TanStack Query의 `persistQueryClient`와 AsyncStorage를 연결하여, 최근 조회한 음식 상세와 즐겨찾기 데이터는 네트워크 없이도 열람 가능하도록 구성합니다.

---

## 11. 확장성 로드맵

### Phase 1: MVP (현재 설계 범위)

- apps/mobile — Expo Router 기반 모바일 앱
- packages/ui, api-client, store, i18n, utils

### Phase 2: 웹 확장

```
apps/
├── mobile/          ← 기존
└── web-admin/       ← Next.js 관리자 대시보드
    ├── 음식 데이터 관리 (CRUD)
    ├── 커뮤니티 모더레이션
    ├── AI 추천 품질 모니터링 (👍👎 피드백 대시보드)
    └── 사용자 통계
```

`@ongo/ui` 패키지를 react-native + react-native-web 호환으로 설계하여, 웹 앱에서도 동일 컴포넌트를 재사용합니다.

### Phase 3: 디자인 시스템 문서화

```
apps/
└── docs/            ← Storybook 기반 컴포넌트 카탈로그
    └── @ongo/ui 컴포넌트 문서 + 인터랙티브 데모
```

### Phase 4: 기능 확장

- `packages/ar-viewer/` — AR 기반 전통 음식 시각화
- `packages/voice-search/` — 음성 검색 모듈 (Figma SearchBar 🎤 버튼)
- `apps/kiosk/` — 전통시장 키오스크용 앱

---

## 12. CI/CD 파이프라인

```
PR 생성
  │
  ├── GitHub Actions: ci.yml
  │   ├── pnpm install (캐시)
  │   ├── turbo lint
  │   ├── turbo typecheck
  │   ├── turbo test
  │   └── turbo build (영향받은 패키지만)
  │
  ├── EAS Update: preview.yml
  │   └── expo-preview 채널 OTA 배포 → QR로 즉시 테스트
  │
main 병합
  │
  ├── staging 배포 (EAS Update staging 채널)
  │
릴리즈 태그
  │
  ├── EAS Build: production.yml
  │   ├── iOS: TestFlight → App Store
  │   └── Android: Internal Track → Google Play
  │
  └── EAS Update: production 채널 (핫픽스용 OTA)
```

---

## 13. 디자인 토큰 (Figma 추출 색상 시스템)

Figma 와이어프레임 컴포넌트에서 추출한 실제 색상 시스템입니다.

```typescript
// packages/ui/tokens/colors.ts
export const colors = {
  // ── 브랜드 (적갈색 — 한국 전통 적토·단청 색) ──
  primary: {
    DEFAULT: '#962E22',   // 메인 브랜드: TabBar active, 레시피 태그 배경, AI 분석 제목
    dark:    '#6B241A',   // FeaturedCard 그라데이션 끝
  },

  // ── 자연 초록 (산림·나물 색) ──
  green: {
    DEFAULT: '#345237',   // 시대 태그 배경, AI 분석 결과 강조 텍스트
  },

  // ── 따뜻한 중성색 (한지·흙·옻 계열) ──
  surface: {
    base:    '#FDFBF7',   // 카드 배경 (FoodCard, ResultCard, PostCard)
    light:   '#F9F6F0',   // 화면/섹션 배경 (TabBar 배경)
    muted:   '#F2EDE3',   // 이미지 영역 배경, 카테고리 칩 배경
  },

  border: {
    DEFAULT: '#E0D9CE',   // 카드 border, 구분선, BottomNav 상단선
  },

  text: {
    primary:   '#261E17', // 제목, 음식 이름 (가장 진한 색)
    secondary: '#665C51', // 본문, 설명, 카테고리 라벨
    tertiary:  '#9E9487', // 비활성 탭, 날짜, 화살표, 좋아요 아이콘
  },

  // ── AI 분석 영역 (보라 계열 — 다른 영역과 시각적 구분) ──
  ai: {
    background: '#F2F0F7',
    border:     '#D9D1E5',
  },

  // ── FeaturedCard 전용 (적갈색 그라데이션 위의 텍스트) ──
  featured: {
    subtitle:    '#FFD9BF', // "오늘의 추천 전통 음식", 한자명
    description: '#FFE5D9', // 설명 텍스트
    tagBg:       'rgba(255, 255, 255, 0.2)', // 카테고리 태그 배경
  },

  // ── 시스템 ──
  white:   '#FFFFFF',
  black:   '#000000',

  // ── 의미 색상 (추후 정의) ──
  semantic: {
    error:   '#D32F2F',
    success: '#2E7D32',
    warning: '#F9A825',
    info:    '#1565C0',
  },
};
```

---

## 14. 컴포넌트별 색상 매핑

Figma 컴포넌트에서 추출한 색상을 컴포넌트별로 정리합니다.

### 14.1 Bottom Navigation

```
┌─────────────────────────────────────────┐
│  배경: white                            │
│  상단 border: border.DEFAULT (#E0D9CE)  │
│                                         │
│  활성 탭:  text primary.DEFAULT (#962E22)│
│  비활성 탭: text tertiary (#9E9487)      │
│  아이콘: 22px / 라벨: 10px semibold     │
└─────────────────────────────────────────┘
```

### 14.2 TabBar (상세 화면 탭)

```
┌─────────────────────────────────────────┐
│  배경: surface.light (#F9F6F0)          │
│  하단 구분선: border.DEFAULT (#E0D9CE)  │
│                                         │
│  선택 탭: text primary.DEFAULT (#962E22)│
│           + 하단 인디케이터 3px bar      │
│             (primary.DEFAULT)           │
│  미선택: text tertiary (#9E9487)        │
│  폰트: 14px, 선택=Bold, 미선택=Medium  │
└─────────────────────────────────────────┘
```

### 14.3 FeaturedCard (오늘의 추천)

```
┌─────────────────────────────────────────┐
│  배경: linear-gradient                  │
│    from primary.DEFAULT (#962E22)       │
│    to   primary.dark (#6B241A)          │
│                                         │
│  라벨 "오늘의 추천": featured.subtitle  │
│                       (#FFD9BF) 12px    │
│  음식 이름: white, 28px Bold            │
│  한자명: featured.subtitle (#FFD9BF)    │
│  설명: featured.description (#FFE5D9)   │
│  태그: white text + featured.tagBg 배경 │
│  라운딩: 16px                           │
└─────────────────────────────────────────┘
```

### 14.4 FoodCard (인기 음식 카드)

```
┌─────────────────────────────────────────┐
│  배경: surface.base (#FDFBF7)           │
│  border: 1px border.DEFAULT (#E0D9CE)   │
│  라운딩: 14px                           │
│                                         │
│  이미지 영역 배경: surface.muted (#F2EDE3)│
│  카테고리 태그: green (#345237) + white │
│    라운딩: 10px, 10px 패딩, 10px 폰트   │
│                                         │
│  음식 이름: text.primary (#261E17) 16px │
│  설명: text.secondary (#665C51) 12px    │
│  좋아요 아이콘: text.tertiary (#9E9487) │
└─────────────────────────────────────────┘
```

### 14.5 FoodResultCard (검색 결과 카드)

```
┌─────────────────────────────────────────┐
│  배경: surface.base (#FDFBF7)           │
│  border: 1px border.DEFAULT (#E0D9CE)   │
│  라운딩: 16px                           │
│                                         │
│  좌측 이미지 영역: surface.muted (#F2EDE3)│
│    시대 태그: green (#345237) + white   │
│    라운딩: 11px                         │
│                                         │
│  음식 이름: text.primary (#261E17) 20px │
│  로마자 표기: text.tertiary (#9E9487) 12px│
│  카테고리 칩: surface.muted 배경        │
│    + text.secondary (#665C51) 11px      │
│  설명: text.secondary (#665C51) 12px    │
│  화살표: text.tertiary (#9E9487) 18px   │
└─────────────────────────────────────────┘
```

### 14.6 AIAnalysisBadge (AI 분석 결과)

```
┌─────────────────────────────────────────┐
│  배경: ai.background (#F2F0F7)          │
│  border: 1px ai.border (#D9D1E5)        │
│  라운딩: 12px                           │
│                                         │
│  제목 "AI 분석 결과":                   │
│    primary.DEFAULT (#962E22) 13px Semi  │
│  분석 내용 "맛: 매운맛 · 색: 빨강":    │
│    text.secondary (#665C51) 12px        │
│  결과 강조 "3개의 전통 음식을 찾았습니다":│
│    green (#345237) 12px SemiBold        │
└─────────────────────────────────────────┘
```

### 14.7 PostCard (커뮤니티 게시글)

```
┌─────────────────────────────────────────┐
│  배경: surface.base (#FDFBF7)           │
│  border: 1px border.DEFAULT (#E0D9CE)   │
│  라운딩: 16px                           │
│                                         │
│  작성자: text.primary (#261E17) 14px Semi│
│  시간: text.tertiary (#9E9487) 11px     │
│  더보기 ⋯: text.tertiary (#9E9487) 20px│
│                                         │
│  사진 영역: surface.muted (#F2EDE3)     │
│                                         │
│  레시피 태그: primary.DEFAULT (#962E22) │
│    배경 + white 텍스트 11px, 라운딩 12px│
│                                         │
│  본문: text.secondary (#665C51) 13px    │
│  좋아요/댓글: text.secondary (#665C51)  │
│    13px Medium                          │
└─────────────────────────────────────────┘
```

### 14.8 Tag (범용 태그 컴포넌트)

| 용도 | 배경 | 텍스트 | 라운딩 | 폰트 |
|------|------|--------|--------|------|
| 시대 태그 (조선시대) | green (#345237) | white | 11px | 10px Medium |
| 카테고리 태그 (국/탕류) | surface.muted (#F2EDE3) | text.secondary (#665C51) | 11px | 11px Medium |
| 레시피 태그 (게시글) | primary (#962E22) | white | 12px | 11px Medium |
| FeaturedCard 태그 | rgba(255,255,255,0.2) | white | 12px | 12px SemiBold |
| 상세 화면 태그 | green (#345237) | white | 11px | 10px Medium |

### 14.9 SearchBar

```
┌─────────────────────────────────────────┐
│  배경: surface.muted (#F2EDE3)          │
│  라운딩: 25px (pill shape)              │
│  높이: 50px                             │
│                                         │
│  placeholder: text.tertiary (#9E9487)   │
│  입력 텍스트: text.primary (#261E17)    │
│  아이콘 🔍🎤: text.secondary (#665C51) │
└─────────────────────────────────────────┘
```

### 14.10 기타 공통 요소

| 요소 | 색상 | 비고 |
|------|------|------|
| 화면 배경 | white (#FFFFFF) | 모든 화면 기본 배경 |
| 헤더 제목 | text.primary (#261E17) | 24px Bold |
| 헤더 뒤로가기 ← | text.primary (#261E17) | 29px |
| 좋아요 ♡ (비활성) | text.tertiary (#9E9487) | |
| 구분선 | border.DEFAULT (#E0D9CE) | 1px |
| 출처 태그 영역 | surface.muted (#F2EDE3) | 13px, text.secondary |
| 피드백 👍👎 버튼 | border.DEFAULT (#E0D9CE) border | 라운딩 8px |
| 댓글 입력 필드 | border.DEFAULT (#E0D9CE) border | 라운딩 18px |
| 댓글 전송 버튼 | primary.DEFAULT (#962E22) 배경 | white ↑ 아이콘 |
| 마이페이지 Stats 구분선 | border.DEFAULT (#E0D9CE) | 1px 세로선 |
| 마이페이지 Stats 숫자 | text.primary (#261E17) | 29px Bold |
| 마이페이지 Stats 라벨 | text.secondary (#665C51) | 15px |
| MenuItem 아이콘 원형 | surface.muted (#F2EDE3) | 36×36 원형 배경 |
| 설정 항목 값 | text.secondary (#665C51) | "한국어", "켜짐" 등 |

---

## 15. 타이포그래피 시스템

Figma에서 추출한 폰트 스케일입니다.

```typescript
// packages/ui/tokens/typography.ts
export const typography = {
  // 제목
  display: {
    fontSize: 28,
    fontWeight: '700', // Bold
    // FeaturedCard 음식 이름
  },
  heading: {
    large: { fontSize: 24, fontWeight: '700' },  // 헤더 제목
    medium: { fontSize: 20, fontWeight: '700' },  // ResultCard 음식 이름
  },

  // 본문
  body: {
    large:  { fontSize: 16, fontWeight: '700' },  // FoodCard 음식 이름
    medium: { fontSize: 14, fontWeight: '600' },  // PostCard 작성자, TabBar 선택
    small:  { fontSize: 13, fontWeight: '500' },  // PostCard 본문, AI 제목
  },

  // 캡션/라벨
  caption: {
    medium: { fontSize: 12, fontWeight: '400' },  // 로마자 표기, 설명, 날짜
    small:  { fontSize: 11, fontWeight: '500' },  // 태그 텍스트, PostCard 시간
    tiny:   { fontSize: 10, fontWeight: '500' },  // BottomNav 라벨, Tag
  },

  // 폰트 패밀리
  fontFamily: {
    sans: 'Inter',   // 기본 (Figma 기준)
    // 프로덕션에서는 Pretendard 또는 Noto Sans KR 적용 검토
  },
};
```

---

## 16. 주요 컴포넌트 인터페이스

```typescript
// packages/ui/src/composites/FoodCard.tsx
interface FoodCardProps {
  id: string;
  nameKo: string;              // "신선로"
  nameLocalized?: string;      // "Sinseollo" (사용자 언어)
  emoji: string;               // "🫕"
  imageUrl?: string;           // 실제 이미지 URL (없으면 emoji 폴백)
  category: FoodCategory;      // "국/탕류"
  description: string;         // "궁중 전골"
  isFavorite: boolean;
  onPress: () => void;
  onFavoriteToggle: () => void;
}

// packages/ui/src/composites/FoodResultCard.tsx
interface FoodResultCardProps {
  id: string;
  nameKo: string;
  nameLocalized?: string;
  emoji: string;
  imageUrl?: string;
  category: FoodCategory;
  era?: string;                // "조선시대"
  description: string;
  onPress: () => void;
}

// packages/ui/src/composites/AIAnalysisBadge.tsx
interface AIAnalysisBadgeProps {
  taste?: string;              // "매운맛"
  color?: string;              // "빨강"
  form?: string;               // "국/탕"
  resultCount: number;         // 3
}

// packages/ui/src/composites/RecipeStep.tsx
interface RecipeStepProps {
  stepNumber: number;
  title: string;               // "소고기 삶기"
  description: string;
  isLast: boolean;             // 연결선 표시 여부
}

// packages/ui/src/composites/HistorySection.tsx
interface HistorySectionProps {
  type: "origin" | "literature" | "ritual";  // 유래/문헌/의례
  icon: string;                // "📜" | "📚" | "🎎"
  title: string;               // "유래 이야기"
  content: string;
  citation?: {                 // 문헌 기록일 때만
    quote: string;
    source: string;            // "산림경제 · 홍만선 · 1715년경"
    onViewOriginal: () => void;
  };
}

// packages/ui/src/composites/PostCard.tsx
interface PostCardProps {
  author: { name: string; avatarUrl?: string };
  createdAt: string;
  category: string;            // "조리 후기"
  images: string[];
  linkedRecipe?: { id: string; nameKo: string; emoji: string };
  content: string;
  likeCount: number;
  commentCount: number;
  isLiked: boolean;
  onPress: () => void;
  onLike: () => void;
  onShare: () => void;
}

// packages/ui/src/composites/PhotoGallery.tsx
interface PhotoGalleryProps {
  images: string[];
  currentIndex: number;
  onIndexChange: (index: number) => void;
}

// packages/ui/src/composites/RecipeLink.tsx
interface RecipeLinkProps {
  foodId: string;
  nameKo: string;
  emoji: string;               // "🍲"
  description: string;         // "산림경제 기반 전통 조리법 · 4단계"
  onPress: () => void;
}

// packages/ui/src/composites/CommentInput.tsx
interface CommentInputProps {
  placeholder?: string;
  onSubmit: (text: string) => void;
}

// packages/ui/src/composites/FeedbackButtons.tsx
interface FeedbackButtonsProps {
  label: string;               // "이 역사 정보가 도움이 되었나요?"
  onPositive: () => void;
  onNegative: () => void;
}

// packages/ui/src/composites/MenuItem.tsx
interface MenuItemProps {
  icon: string;                // "♡"
  title: string;               // "즐겨찾기 목록"
  description: string;         // "저장한 전통 음식 12개"
  onPress: () => void;
}
```

---

이 설계는 Figma 와이어프레임의 13개 화면과 기획서의 기능 요구사항을 반영하며, Turborepo의 패키지 분리를 통해 향후 웹 관리자, 키오스크, 디자인 시스템 문서 등으로의 확장이 자연스럽게 이루어질 수 있는 구조입니다.
