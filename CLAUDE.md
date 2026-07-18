# 온고지식(On-go 지식) 프로젝트 규칙

## 프로젝트 개요
한국 전통 음식 AI 추천 서비스. Turborepo + Expo(React Native) 모노레포.
조직 스코프: `@ongo`, 패키지: ui, api-client, store, i18n, utils, typescript-config

## 기술 스택
- 모노레포: Turborepo + pnpm workspace (catalog 버전 관리)
- 앱: Expo SDK 52+, Expo Router v4 (파일 기반 라우팅)
- 스타일: NativeWind v4 (Tailwind)
- 서버 상태: TanStack Query v5
- 클라이언트 상태: Jotai (atom 기반)
- 다국어: i18next (ko/en/ja/zh)
- 이미지: expo-image, 폼: react-hook-form + zod

## 핵심 규칙 (항상 준수)

### 필수
- Named Export만 사용 (`export default` 금지)
- JSDoc + `@author` — 모든 공개 함수, 컴포넌트, 훅
- 타입에 `T` 접두사 — `TFood`, `TSearchRequest` (Props는 예외: `FoodCardProps`)
- 서버 상태 → TanStack Query / 클라이언트 상태 → Jotai (혼용 금지)
- Query Key 팩토리 패턴 — `foodKeys.detail(id)`
- 음식 이름 항상 한국어 병기 — `formatFoodName()` 사용
- UI 텍스트는 번역 키 사용 (하드코딩 금지)
- Pressable 사용 (TouchableOpacity 금지)
- expo-image 사용 (RN Image 금지)
- Import 순서: React/RN → 외부 라이브러리 → @ongo/* → 상대 경로 → type import

### 금지
- `any` 타입, `var` 키워드, 인라인 스타일
- console.log 커밋 (`__DEV__` 가드 필수)
- 패키지 순환 참조 (Apps→Packages만 허용, 역방향 금지)
- 컴포넌트 내 API 직접 호출 (Query/Mutation 훅 사용)
- atom에 서버 데이터 저장, 컴포넌트 내부에서 atom 정의
- 하드코딩된 색상값 (디자인 토큰 사용)

## 상세 규칙 문서
작업 영역에 따라 아래 파일을 참조하세요 (생성되면 자동 포함):

@rules/01-naming.md
@rules/02-component.md
@rules/03-api-query.md
@rules/04-jotai.md
@rules/05-routing-i18n.md
@rules/06-git-checklist.md
@rules/api-usage.md
