# 온고지식 (OngoJishik) — Client

> **온고지식(溫故 지식)** — 지식재산처의 공공데이터를 기반으로 한국 전통 음식을 AI로 추천하는 서비스의 프론트엔드 모노레포입니다.
> 사용자가 맛, 재료, 상황 등을 자연어로 입력하면 AI가 이를 분석해 전통 음식을 추천하고, 조리법·식재료·역사적 배경을 스토리텔링 형태로 제공합니다.

- 백엔드 레포: [OngoJishik-BE](https://github.com/OngoJishik)
- 제4회 문화체육관광 인공지능·데이터 활용 공모전 출품작

## 목차

- [소개](#소개)
- [기술 스택](#기술-스택)
- [모노레포 구조](#모노레포-구조)
- [주요 기능](#주요-기능)
- [디자인](#디자인)
- [시작하기](#시작하기)
- [스크립트](#스크립트)
- [코드 컨벤션](#코드-컨벤션)
- [문서](#문서)

## 소개

정보가 분산되어 접근이 어려운 한국 전통 음식 데이터를 통합하고, AI 기반 자연어 추천과 다국어(한/영/일/중) 지원을 통해 국내외 사용자의 전통 음식 탐색 장벽을 낮추는 것을 목표로 합니다.

- 음식명을 몰라도 "매콤한 국물 음식", "명절에 먹는 음식"처럼 자연어로 검색
- 문헌 기록·원문·번역문 기반의 조리법과 유래를 스토리텔링으로 제공
- 실제 사진 확보가 어려운 전통 음식은 AI 생성 이미지로 시각적 이해를 보완
- 추천 음식의 식재료와 연계된 근처 전통시장 안내
- 커뮤니티(후기/레시피/질문 게시판)를 통한 사용자 간 정보 공유

## 기술 스택

| 영역 | 스택 |
| --- | --- |
| 모노레포 | Turborepo, pnpm workspace (catalog 버전 관리) |
| 앱 프레임워크 | Expo SDK 54, React Native 0.81, Expo Router v6 (파일 기반 라우팅) |
| 스타일링 | NativeWind v4 (Tailwind for RN) |
| 서버 상태 | TanStack Query v5 (캐싱, 무한 스크롤, 낙관적 업데이트) |
| 클라이언트 상태 | Jotai (atom 기반) |
| 폼 | react-hook-form + zod |
| 다국어 | i18next / react-i18next (ko, en, ja, zh) |
| 인증 | Google Sign-In → 서버 발급 JWT (Access/Refresh) |
| 로컬 저장소 | AsyncStorage (인증 토큰, 사용자 프로필 영속화) |
| 이미지 | expo-image |
| 배포 | EAS Build / GitHub Actions CI |

## 모노레포 구조

```
.
├── apps/
│   └── mobile/              # Expo Router 기반 모바일 앱
│       └── app/
│           ├── (auth)/      # 로그인
│           ├── (tabs)/      # 홈 · 커뮤니티 · 마이페이지 탭
│           ├── community/   # 게시글 상세 · 작성
│           ├── food/        # 음식 상세
│           ├── search/      # 검색 결과
│           ├── settings/    # 언어 · 권한 · 서비스 정보
│           └── favorites.tsx, search-history.tsx, my-posts.tsx, my-comments.tsx  # 마이페이지 하위 화면
├── packages/
│   ├── api-client/          # axios + TanStack Query 기반 API 훅, 엔드포인트, 타입
│   ├── store/                # Jotai atom (클라이언트 상태)
│   ├── ui/                   # 디자인 시스템 (primitives, composites, 디자인 토큰)
│   ├── i18n/                  # 다국어 리소스 (ko/en/ja/zh)
│   ├── utils/                 # 공용 유틸리티
│   └── typescript-config/     # 공유 tsconfig
├── rules/                     # 코드 컨벤션 상세 문서
├── docs/                      # 빌드/배포 트러블슈팅 문서
└── turbo.json / pnpm-workspace.yaml
```

`@ongo/*` 스코프 패키지로 구성되며, 의존 방향은 `apps → packages`로만 허용됩니다(패키지 간 역참조 금지).

## 주요 기능

- **로그인**: Google 소셜 로그인, 최초 로그인 시 자동 회원 등록
- **홈**: 매일 3개의 추천 전통 음식과 인기 음식 노출
- **AI 음식 검색/추천**: 자연어 입력 → 특징 추출 → 음식 매칭, 분석 결과 근거 카드 제공
- **음식 상세**: 대표 이미지(실사 또는 AI 생성), 식재료, 조리법(단계별), 문헌 원문·번역문, 근처 전통시장
- **커뮤니티**: 후기/레시피/질문 게시글 작성·조회·수정·삭제, 댓글, 좋아요
- **마이페이지**: 즐겨찾기, 검색 기록, 작성한 글/댓글, 언어·권한 설정
- **다국어**: 설정에서 한국어/영어/일본어/중국어 전환

## 디자인

Figma로 설계한 한국 전통 미감을 디자인 토큰화하여 `packages/ui`에 반영했습니다.

- 배경: 한지 질감 베이지 톤 `#F9F6F0`
- 포인트: 단청에서 따온 적갈색 `#962E22`
- 보조: 산림을 표현한 초록색 `#345237`
- 강조: 금색 `#D1AE5D`

## 시작하기

### 사전 요구사항

- Node.js 20+
- pnpm 9.15.9 (`packageManager` 필드로 고정)
- Expo CLI / EAS CLI (네이티브 빌드 시)

### 설치 및 실행

```bash
# 의존성 설치 (루트에서 실행)
pnpm install

# 개발 서버 실행 (전체 워크스페이스, Turborepo)
pnpm dev

# 모바일 앱만 실행
cd apps/mobile
pnpm start        # Expo 개발 서버
pnpm android       # Android 실행
pnpm ios           # iOS 실행
```

환경 변수(API Base URL, Google Sign-In 클라이언트 ID 등)는 `apps/mobile`의 환경 설정 파일을 참고해 구성해야 합니다.

## 스크립트

루트 `package.json` 기준 (Turborepo로 각 워크스페이스에 전파됩니다):

| 명령어 | 설명 |
| --- | --- |
| `pnpm dev` | 전체 워크스페이스 개발 모드 실행 |
| `pnpm build` | 전체 워크스페이스 빌드 |
| `pnpm lint` | 전체 워크스페이스 린트 |
| `pnpm typecheck` | 전체 워크스페이스 타입 체크 |
| `pnpm test` | 전체 워크스페이스 테스트 |
| `pnpm android` / `pnpm ios` | Expo 네이티브 앱 실행 |

## 코드 컨벤션

프로젝트 전반의 규칙은 [`CLAUDE.md`](./CLAUDE.md)와 [`rules/`](./rules) 디렉토리에 정리되어 있습니다. 핵심 규칙 요약:

- **Named Export**만 사용 (`export default` 금지)
- 모든 공개 함수/컴포넌트/훅에 JSDoc + `@author` 명시
- 타입에는 `T` 접두사 사용 (예: `TFood`, `TSearchRequest`), Props는 예외
- 서버 상태는 TanStack Query, 클라이언트 상태는 Jotai로 분리 (혼용 금지)
- Query Key는 팩토리 패턴 사용 (예: `foodKeys.detail(id)`)
- UI 텍스트는 하드코딩 대신 i18next 번역 키 사용
- `Pressable` 사용 (`TouchableOpacity` 금지), `expo-image` 사용 (RN `Image` 금지)
- `any`, `var`, 인라인 스타일, 하드코딩된 색상값 금지
- 컴포넌트 내부에서 API 직접 호출 금지 → Query/Mutation 훅 경유

세부 규칙: [`01-naming`](./rules/01-naming.md) · [`02-component`](./rules/02-component.md) · [`03-api-query`](./rules/03-api-query.md) · [`04-jotai`](./rules/04-jotai.md) · [`05-routing-i18n`](./rules/05-routing-i18n.md) · [`06-git-checklist`](./rules/06-git-checklist.md)

## 문서

- [`ongo-client-architecture.md`](./ongo-client-architecture.md) — 프론트엔드 아키텍처 상세 문서
- [`docs/android-local-build-guide.md`](./docs/android-local-build-guide.md) — Android 로컬 빌드 가이드
- [`docs/apk-release-troubleshooting.md`](./docs/apk-release-troubleshooting.md) — APK 릴리즈 트러블슈팅
- [`docs/login-auth-routing-fix.md`](./docs/login-auth-routing-fix.md) — 로그인/인증 라우팅 관련 수정 기록
- [`docs/expo-sdk-54-upgrade.md`](./docs/expo-sdk-54-upgrade.md) — Expo SDK 52 → 54 업그레이드 기록 (16kb 페이지 사이즈 대응)
