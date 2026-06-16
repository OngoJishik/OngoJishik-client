import type { TSearchFilters } from '../types/search';
import type { TBoardCategory } from '../types/community';

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
  boards: () => [...communityKeys.all, 'board'] as const,
  boardList: (page?: number, size?: number, category?: TBoardCategory) =>
    [...communityKeys.boards(), 'list', { page, size, category }] as const,
  boardSearch: (title: string, page?: number, category?: TBoardCategory) =>
    [...communityKeys.boards(), 'search', { title, page, category }] as const,
  boardDetail: (boardId: number) =>
    [...communityKeys.boards(), 'detail', boardId] as const,
  myBoards: (page?: number, size?: number) =>
    [...communityKeys.boards(), 'me', { page, size }] as const,
  comments: (boardId: number, page?: number) =>
    [...communityKeys.all, 'comments', boardId, { page }] as const,
  likeCount: (boardId: number) =>
    [...communityKeys.all, 'likeCount', boardId] as const,
  myComments: (page?: number) =>
    [...communityKeys.all, 'myComments', { page }] as const,
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
