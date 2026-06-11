# 01. 네이밍 규칙

## 파일/폴더

| 대상 | 규칙 | 예시 |
|------|------|------|
| 컴포넌트 폴더/파일 | PascalCase | `FoodCard/FoodCard.tsx` |
| 스타일 파일 | PascalCase.styles.ts | `FoodCard.styles.ts` |
| 훅 파일 | camelCase, `use` 접두사 | `useSearch.ts` |
| 서비스/유틸 파일 | camelCase | `food.ts`, `formatters.ts` |
| Atom 파일 | camelCase + Atom | `searchAtom.ts` |
| 라우트 파일 | kebab-case (Expo Router) | `food/[id].tsx` |

## 변수/함수

```typescript
// 변수: camelCase / 상수: UPPER_SNAKE_CASE
const userName = "하나";
const API_BASE_URL = "https://api.example.com";

// 이벤트 핸들러: handle + 대상 + 동작
const handleSearchSubmit = () => {};
const handleFavoriteToggle = () => {};

// API 함수: HTTP 동사 + 리소스명
const getFoodDetail = (id: string) => {};
const createPost = (data: TPostCreateRequest) => {};
const searchFoods = (query: string) => {};
```

## 타입

| 유형 | 규칙 | 예시 |
|------|------|------|
| 도메인 타입 | `T` 접두사 | `TFood`, `TPost` |
| API 응답/요청 | `T...Response/Request` | `TSearchResponse`, `TPostCreateRequest` |
| Props | `...Props` (T 접두사 없음) | `FoodCardProps` |
| Enum 대용 | UPPER_SNAKE_CASE 유니온 | `"SOUP" \| "GRILL"` |

```typescript
export type TFood = {
  id: string;
  nameKo: string;
  nameLocalized?: string;
  category: TFoodCategory;
};

export type TFoodCategory =
  | "TTEOK" | "SOUP" | "GRILL" | "NAMUL"
  | "JJIM" | "MYEON" | "HANGWA" | "EUMCHUNG";

export type TLanguage = "ko" | "en" | "ja" | "zh";

export type TApiResponse<T> = {
  status: number;
  message: string;
  data: T;
};
```

## Jotai Atom 네이밍

```typescript
// 기본 atom: 명사 + Atom
export const authTokenAtom = atom<string | null>(null);
export const searchHistoryAtom = atom<string[]>([]);

// 파생 atom: 명사 + Atom
export const isLoggedInAtom = atom((get) => get(authTokenAtom) !== null);

// 쓰기 전용 atom: 동사 + Atom
export const addSearchHistoryAtom = atom(null, (get, set, query: string) => {
  const history = get(searchHistoryAtom);
  set(searchHistoryAtom, [query, ...history.filter((q) => q !== query)].slice(0, 20));
});
```
