import type { TSearchFilters } from '../types/search';

/**
 * 음식 관련 TanStack Query Key 팩토리 객체
 * @author Antigravity
 */
export const foodKeys = {
  all: ['food'] as const,
  searches: () => [...foodKeys.all, 'search'] as const,
  search: (query: string, filters?: TSearchFilters) =>
    [...foodKeys.searches(), { query, filters }] as const,
  details: () => [...foodKeys.all, 'detail'] as const,
  detail: (id: string) => [...foodKeys.details(), id] as const,
  recommendation: () => [...foodKeys.all, 'recommendation'] as const,
  popular: () => [...foodKeys.all, 'popular'] as const,
};

/**
 * 커뮤니티 관련 TanStack Query Key 팩토리 객체
 * @author Antigravity
 */
export const communityKeys = {
  all: ['community'] as const,
  feeds: () => [...communityKeys.all, 'feed'] as const,
  feed: (category?: string, page?: number) =>
    [...communityKeys.feeds(), { category, page }] as const,
  posts: () => [...communityKeys.all, 'post'] as const,
  post: (postId: string) => [...communityKeys.posts(), postId] as const,
  comments: (postId: string) =>
    [...communityKeys.all, 'comments', postId] as const,
};

/**
 * 사용자 정보 및 즐겨찾기 관련 TanStack Query Key 팩토리 객체
 * @author Antigravity
 */
export const userKeys = {
  all: ['user'] as const,
  profile: () => [...userKeys.all, 'profile'] as const,
  favorites: () => [...userKeys.all, 'favorites'] as const,
  searchHistory: () => [...userKeys.all, 'searchHistory'] as const,
  posts: () => [...userKeys.all, 'posts'] as const,
};

/**
 * 역사 스토리 관련 TanStack Query Key 팩토리 객체
 * @author Antigravity
 */
export const historyKeys = {
  all: ['history'] as const,
  story: (foodId: string) => [...historyKeys.all, foodId] as const,
};

