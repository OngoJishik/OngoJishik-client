# 04. Jotai 상태 관리 패턴

## 파일 구조

```
packages/store/src/
├── atoms/
│   ├── authAtom.ts          # 인증 토큰, 유저 정보
│   ├── searchAtom.ts        # 검색 히스토리, 필터
│   ├── languageAtom.ts      # 언어 설정
│   ├── favoriteAtom.ts      # 즐겨찾기 로컬 캐시
│   └── uiAtom.ts            # UI 상태 (모달 등)
├── derived/
│   ├── currentUserAtom.ts
│   └── recentSearchAtom.ts
└── index.ts                 # 전체 re-export
```

## Atom 작성 예시

```typescript
// atoms/searchAtom.ts
import { atom } from "jotai";
import { atomWithStorage } from "jotai/utils";

const MAX_SEARCH_HISTORY = 20;

/** 검색 히스토리 (AsyncStorage 영속) */
export const searchHistoryAtom = atomWithStorage<string[]>("search-history", []);

/** 현재 검색 필터 */
export const searchFiltersAtom = atom<TSearchFilters>({
  category: undefined,
  taste: undefined,
  situation: undefined,
});

/** 검색어 추가 (쓰기 전용) */
export const addSearchQueryAtom = atom(null, (get, set, query: string) => {
  const history = get(searchHistoryAtom);
  const updated = [query, ...history.filter((q) => q !== query)].slice(0, MAX_SEARCH_HISTORY);
  set(searchHistoryAtom, updated);
});

/** 검색어 단건 삭제 */
export const removeSearchQueryAtom = atom(null, (get, set, query: string) => {
  set(searchHistoryAtom, get(searchHistoryAtom).filter((q) => q !== query));
});

/** 검색 히스토리 전체 삭제 */
export const clearSearchHistoryAtom = atom(null, (_get, set) => {
  set(searchHistoryAtom, []);
});
```

## 사용 패턴

```typescript
import { useAtom, useAtomValue, useSetAtom } from "jotai";

const SearchScreen = () => {
  // 읽기만 → useAtomValue
  const searchHistory = useAtomValue(searchHistoryAtom);

  // 쓰기만 → useSetAtom
  const addSearch = useSetAtom(addSearchQueryAtom);
  const clearHistory = useSetAtom(clearSearchHistoryAtom);

  // 읽기+쓰기 → useAtom
  const [filters, setFilters] = useAtom(searchFiltersAtom);

  const handleSearch = (query: string) => {
    addSearch(query);
  };
};
```

## 규칙

### 필수
- 읽기만 → `useAtomValue` / 쓰기만 → `useSetAtom` / 둘 다 → `useAtom`
- 영속 상태 → `atomWithStorage` (AsyncStorage)
- 복잡한 쓰기 로직 → 쓰기 전용 atom으로 분리
- atom은 모듈 레벨(파일 최상위)에서 정의

### 금지
- 컴포넌트 내부에서 atom 생성
- 서버 상태(API 데이터)를 atom에 저장 → TanStack Query 사용
- atom 간 순환 참조
