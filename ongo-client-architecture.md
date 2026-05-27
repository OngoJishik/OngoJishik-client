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
│   │   │   │   └── [id].tsx         # 음식 상세 화면 (탭: 조리법/식재료/역사/문헌/건강)
│   │   │   ├── search/
│   │   │   │   └── results.tsx      # 검색 결과 화면
│   │   │   ├── community/
│   │   │   │   ├── [postId].tsx     # 게시글 상세
│   │   │   │   └── write.tsx        # 게시글 작성
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
│   │   │   │   ├── CategoryChip.tsx      # 카테고리 아이콘 칩
│   │   │   │   ├── RecipeStep.tsx        # 조리법 단계 표시
│   │   │   │   ├── HistorySection.tsx    # 역사 이야기 섹션
│   │   │   │   ├── LiteratureQuote.tsx   # 문헌 인용 블록
│   │   │   │   ├── PostCard.tsx          # 커뮤니티 게시글 카드
│   │   │   │   ├── CommentInput.tsx      # 댓글 입력
│   │   │   │   ├── TabBar.tsx            # 상세 화면 탭 바
│   │   │   │   ├── AIAnalysisBadge.tsx   # AI 분석 결과 표시
│   │   │   │   ├── DataSourceTag.tsx     # 출처 표시 태그
│   │   │   │   ├── FeedbackButtons.tsx   # 👍👎 피드백 버튼
│   │   │   │   └── MenuItem.tsx          # 마이페이지 메뉴 아이템
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

Figma 와이어프레임에서 도출한 7개 주요 화면과 각 화면에 사용되는 컴포넌트 구성입니다.

### 3.1 홈 화면 (`(tabs)/index.tsx`)

```
┌─ Header ─────────────────────────────┐
│  🍚 온고지식              🔔          │
├─ SearchBar ──────────────────────────┤
│  🔍 어떤 전통 음식이 궁금하세요?  🎤  │
├─ FeaturedCard ───────────────────────┤
│  오늘의 추천 전통 음식                │
│  구절판 (九節板)                      │
│  "아홉 가지 재료를 담은 궁중 요리"    │
├─ FoodCard × N (가로 스크롤) ─────────┤
│  [신선로] [만두] [약과] [송편] →      │
├─ CategoryChip × 8 ──────────────────┤
│  떡류 국/탕 구이 나물 찜/조림 ...     │
├─ BottomNav ──────────────────────────┤
│  🏠홈  🔍검색  📖역사  💬커뮤니티  👤마이│
└──────────────────────────────────────┘
```

### 3.2 검색 화면 (`(tabs)/search.tsx`)

```
┌─ Header (← 검색) ───────────────────┐
├─ SearchBar (active, 입력 중) ────────┤
│  🔍 매콤하고 빨간 국물 요리      ✕   │
├─ AIAnalysisBadge ────────────────────┤
│  🤖 맛: 매운맛 · 색: 빨강 · 형태: 국/탕│
├─ 최근 검색어 리스트 ─────────────────┤
│  🕐 설날에 먹는 음식              ✕   │
│  🕐 궁중 요리 추천                ✕   │
│  🕐 I saw a colorful layered ...  ✕   │
├─ 추천 검색어 Chip 그리드 ────────────┤
│  #떡국  #김치찌개  #비빔밥  #약과      │
└──────────────────────────────────────┘
```

### 3.3 검색 결과 화면 (`search/results.tsx`)

```
┌─ Header (← 검색 결과) ──────────────┐
├─ Query Bar (검색어 표시) ────────────┤
├─ 정렬/필터 바 ───────────────────────┤
├─ FoodResultCard × N ─────────────────┤
│  ┌────┬──────────────────────┐       │
│  │ 🍲 │ 육개장 Yukgaejang     │       │
│  │    │ [국/탕류] 매콤한 소고기│       │
│  │조선 │ 국물에 고사리...   →  │       │
│  └────┴──────────────────────┘       │
├─ DataSourceTag ──────────────────────┤
│  📋 출처: 특허청 한국전통지식포탈      │
└──────────────────────────────────────┘
```

### 3.4 음식 상세 화면 (`food/[id].tsx`)

```
┌─ Hero Image (뒤로가기/공유/좋아요) ──┐
│         🍲 (연출 이미지)              │
├─ Food Info ──────────────────────────┤
│  육개장  Yukgaejang · 肉개醬          │
│  [국/탕류] [매운맛] [보양식] [소고기]  │
│  출처: 특허청 전통지식포탈             │
├─ TabBar ─────────────────────────────┤
│  조리법 │ 식재료 │ 역사이야기 │ 문헌 │ 건강│
├─ Tab Content ────────────────────────┤
│  (RecipeStep / 식재료목록 / History / │
│   LiteratureQuote / 건강정보)         │
├─ Bottom Action ──────────────────────┤
│  [♡]  [📋 재료 구매처 보기 (전통시장)]│
└──────────────────────────────────────┘
```

### 3.5 커뮤니티 화면 (`(tabs)/community.tsx`)

```
┌─ Header (커뮤니티   ✏️) ─────────────┐
├─ Filter Tabs ────────────────────────┤
│  [전체] [조리 후기] [나만의 레시피] [Q&A]│
├─ PostCard × N ───────────────────────┤
│  전통요리사_하나 · 2시간 전           │
│  [사진 영역]                          │
│  📋 육개장 레시피                     │
│  "할머니 레시피로 만든 육개장! ..."    │
│  ❤️128  💬23  ↗공유                  │
└──────────────────────────────────────┘
```

### 3.6 게시글 작성 (`community/write.tsx`)

```
┌─ Header (✕  게시글 작성  [등록]) ────┐
├─ Category Selector ──────────────────┤
│  [조리 후기] [나만의 레시피] [질문/답변]│
├─ Recipe Tag ─────────────────────────┤
│  📋 레시피 태그 → [🍲 육개장 ✕]       │
├─ Photo Upload ───────────────────────┤
│  [📷추가] [사진1] [사진2]             │
├─ Text Input ─────────────────────────┤
│  (본문 입력 영역)  124/1000           │
└──────────────────────────────────────┘
```

### 3.7 마이페이지 (`(tabs)/mypage.tsx`)

```
┌─ Header (마이페이지  ⚙) ─────────────┐
├─ Profile ────────────────────────────┤
│  전통요리사_하나 / hana@gmail.com     │
├─ Stats (가로 3열) ───────────────────┤
│  12즐겨찾기 │ 5게시글 │ 28검색       │
├─ MenuItem × 3 ───────────────────────┤
│  ♡ 즐겨찾기 목록  →                   │
│  🕐 검색 기록      →                   │
│  📝 내 게시글      →                   │
├─ 설정 영역 ──────────────────────────┤
│  🌐 언어 설정   한국어 →              │
│  🔔 알림 설정   켜짐   →              │
│  ℹ️ 앱 정보    v1.0.0 →              │
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

Expo Router 파일 기반 라우팅으로, Figma 와이어프레임의 내비게이션 흐름을 정확히 반영합니다.

```
app/
├── _layout.tsx              ← Root: Provider 주입 (Theme, Query, i18n, Auth)
├── (tabs)/
│   ├── _layout.tsx          ← Tab Navigator (5탭: 홈/검색/역사/커뮤니티/마이)
│   ├── index.tsx            ← 🏠 홈
│   ├── search.tsx           ← 🔍 검색 (입력 + 최근 + 추천)
│   ├── history.tsx          ← 📖 역사 탐색
│   ├── community.tsx        ← 💬 커뮤니티 피드
│   └── mypage.tsx           ← 👤 마이페이지
├── food/
│   └── [id].tsx             ← 음식 상세 (Stack 푸시)
├── search/
│   └── results.tsx          ← 검색 결과 (Stack 푸시)
├── community/
│   ├── [postId].tsx         ← 게시글 상세
│   └── write.tsx            ← 게시글 작성 (Modal 프레젠테이션)
├── settings/
│   ├── language.tsx
│   └── notifications.tsx
└── (auth)/
    └── login.tsx            ← 로그인 (Google OAuth)
```

**탭 구성 (Figma Bottom Navigation 기반):**

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

## 13. 디자인 토큰 (한국 전통색 기반)

기획서의 전통 음식 테마에 맞춘 색상 시스템입니다.

```typescript
// packages/ui/tokens/colors.ts
export const colors = {
  // 주요 색상 — 한국 전통색에서 착안
  primary: {
    50:  '#FFF5F0',
    100: '#FFE4D6',
    200: '#FFC4A8',
    300: '#FF9E73',  // 고추장 색
    400: '#E8723A',
    500: '#C85A28',  // 메인 브랜드 컬러
    600: '#A04420',
    700: '#7A3218',
  },
  
  // 보조 색상 — 자연의 색
  secondary: {
    50:  '#F0F7F0',
    100: '#D4E8D4',
    300: '#7CB87C',
    500: '#4A8C4A',  // 나물/산채 초록
    700: '#2D5E2D',
  },

  // 중성 색상
  neutral: {
    0:   '#FFFFFF',
    50:  '#FAFAF8',  // 한지 색
    100: '#F5F3EF',
    200: '#E8E4DD',
    300: '#D4CFC6',
    500: '#8C8578',
    700: '#4A463E',
    900: '#1C1A16',
  },

  // 의미 색상
  semantic: {
    error:   '#D32F2F',
    success: '#2E7D32',
    warning: '#F9A825',
    info:    '#1565C0',
  },

  // 카테고리 색상
  category: {
    tteok:    '#E8A87C', // 떡류 — 떡 색
    soup:     '#C85A28', // 국/탕 — 붉은 국물
    grill:    '#8B5E3C', // 구이 — 숯불
    namul:    '#4A8C4A', // 나물 — 초록
    jjim:     '#B85C38', // 찜/조림
    myeon:    '#D4CFC6', // 면류
    hangwa:   '#E8C87C', // 한과 — 꿀색
    eumchung: '#7CB87C', // 음청류 — 연한 초록
  },
};
```

---

## 14. 주요 컴포넌트 인터페이스

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

// packages/ui/src/composites/RecipeStep.tsx
interface RecipeStepProps {
  stepNumber: number;
  title: string;               // "소고기 삶기"
  description: string;
  isLast: boolean;             // 연결선 표시 여부
}

// packages/ui/src/composites/PostCard.tsx
interface PostCardProps {
  author: { name: string; avatarUrl?: string };
  createdAt: string;
  language?: string;           // "English"
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
```

---

이 설계는 기획서의 모든 화면(8개 화면)과 기능 요구사항을 반영하며, Turborepo의 패키지 분리를 통해 향후 웹 관리자, 키오스크, 디자인 시스템 문서 등으로의 확장이 자연스럽게 이루어질 수 있는 구조입니다.
