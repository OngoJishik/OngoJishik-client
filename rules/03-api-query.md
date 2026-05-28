# 03. API 서비스 레이어 & TanStack Query 패턴

## 서비스 폴더 구조

```
packages/api-client/src/
├── client.ts              # Axios 인스턴스, 인터셉터
├── endpoints/
│   ├── food.ts            # 음식 API 함수
│   ├── history.ts         # 역사 API
│   ├── community.ts       # 커뮤니티 API
│   ├── auth.ts            # 인증 API
│   ├── user.ts            # 유저 API
│   └── market.ts          # 전통시장 API
├── hooks/
│   ├── queryKeys.ts       # Query Key 팩토리 (전체)
│   ├── useSearch.ts       # 검색 Query
│   ├── useFoodDetail.ts   # 음식 상세 Query
│   ├── useCommunity.ts    # 커뮤니티 Query/Mutation
│   └── useFavorites.ts    # 즐겨찾기 Query/Mutation
└── types/
    ├── food.ts
    ├── community.ts
    └── common.ts
```

## API 함수 작성

```typescript
// endpoints/food.ts
import { apiClient } from "../client";
import type { TFood, TFoodDetail, TSearchRequest, TSearchResponse } from "../types/food";

/**
 * AI 기반 전통 음식 검색
 * @author 작성자
 */
export const searchFoods = async (params: TSearchRequest): Promise<TSearchResponse> => {
  const { data } = await apiClient.post<TSearchResponse>("/food/search", params);
  return data;
};

/**
 * 전통 음식 상세 정보 조회
 * @author 작성자
 */
export const getFoodDetail = async (foodId: string): Promise<TFoodDetail> => {
  const { data } = await apiClient.get<TFoodDetail>(`/food/${foodId}`);
  return data;
};
```

원칙: 함수 하나 = 엔드포인트 하나, 반환 타입 명시, JSDoc 필수

## Query Key 팩토리

```typescript
// hooks/queryKeys.ts
export const foodKeys = {
  all: ["food"] as const,
  searches: () => [...foodKeys.all, "search"] as const,
  search: (query: string, filters?: TSearchFilters) =>
    [...foodKeys.searches(), { query, filters }] as const,
  details: () => [...foodKeys.all, "detail"] as const,
  detail: (id: string) => [...foodKeys.details(), id] as const,
  recommendation: () => [...foodKeys.all, "recommendation"] as const,
  popular: () => [...foodKeys.all, "popular"] as const,
};

export const communityKeys = {
  all: ["community"] as const,
  feeds: () => [...communityKeys.all, "feed"] as const,
  feed: (category?: string, page?: number) =>
    [...communityKeys.feeds(), { category, page }] as const,
  posts: () => [...communityKeys.all, "post"] as const,
  post: (postId: string) => [...communityKeys.posts(), postId] as const,
  comments: (postId: string) =>
    [...communityKeys.all, "comments", postId] as const,
};

export const userKeys = {
  all: ["user"] as const,
  profile: () => [...userKeys.all, "profile"] as const,
  favorites: () => [...userKeys.all, "favorites"] as const,
  searchHistory: () => [...userKeys.all, "searchHistory"] as const,
  posts: () => [...userKeys.all, "posts"] as const,
};
```

## Query 훅

```typescript
// hooks/useFoodDetail.ts
import { useQuery } from "@tanstack/react-query";
import { getFoodDetail } from "../endpoints/food";
import { foodKeys } from "./queryKeys";

/**
 * 전통 음식 상세 정보 조회 훅
 * @author 작성자
 */
export const useFoodDetailQuery = (foodId: string) => {
  return useQuery({
    queryKey: foodKeys.detail(foodId),
    queryFn: () => getFoodDetail(foodId),
    enabled: !!foodId,
    staleTime: 1000 * 60 * 60 * 24, // 24h
  });
};
```

## Mutation 훅

```typescript
// hooks/useCommunity.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createPost, toggleLike } from "../endpoints/community";
import { communityKeys, userKeys } from "./queryKeys";

/**
 * 게시글 작성 뮤테이션
 * @author 작성자
 */
export const useCreatePostMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: TPostCreateRequest) => createPost(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: communityKeys.feeds() });
      queryClient.invalidateQueries({ queryKey: userKeys.posts() });
    },
  });
};

/**
 * 좋아요 토글 (낙관적 업데이트)
 * @author 작성자
 */
export const useToggleLikeMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (postId: string) => toggleLike(postId),
    onMutate: async (postId) => {
      await queryClient.cancelQueries({ queryKey: communityKeys.post(postId) });
      const previous = queryClient.getQueryData(communityKeys.post(postId));
      return { previous };
    },
    onError: (_err, postId, context) => {
      queryClient.setQueryData(communityKeys.post(postId), context?.previous);
    },
    onSettled: (_data, _err, postId) => {
      queryClient.invalidateQueries({ queryKey: communityKeys.post(postId) });
    },
  });
};
```

## 캐싱 전략

| 데이터 | staleTime | gcTime |
|--------|-----------|--------|
| 오늘의 추천 | 1h | 24h |
| 음식 상세 | 24h | 7d |
| 역사 스토리 | 7d | 30d |
| 검색 결과 | 5m | 1h |
| 커뮤니티 피드 | 30s | 5m |
| 사용자 프로필 | 5m | 1h |
