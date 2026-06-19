import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { userEndpoints } from '../endpoints/user';
import { foodKeys, bookmarkKeys } from './queryKeys';
import type { TBookmarkResponse, TBookmarkListResponse } from '../types/bookmark';
import type { TFoodDetailResponse } from '../types/food';

/**
 * 사용자의 즐겨찾기(북마크) 목록 조회 훅 (GET /api/bookmarks)
 * @author Antigravity
 */
export const useFavoritesQuery = () => {
  return useQuery({
    queryKey: bookmarkKeys.list(),
    queryFn: () => userEndpoints.getBookmarks(),
    staleTime: 5 * 60 * 1000, // 5m
    gcTime: 1 * 60 * 60 * 1000, // 1h
  });
};

/**
 * 게시글 작성/수정 시 recipeId로 선택 가능한 북마크 음식 레시피 목록 조회 훅
 * (GET /api/bookmarks/recipes)
 * @author Antigravity
 */
export const useBookmarkedRecipesQuery = () => {
  return useQuery({
    queryKey: bookmarkKeys.recipes(),
    queryFn: () => userEndpoints.getBookmarkedRecipes(),
    staleTime: 5 * 60 * 1000, // 5m
    gcTime: 1 * 60 * 60 * 1000, // 1h
  });
};

/**
 * 즐겨찾기 추가 뮤테이션 훅 — 낙관적 업데이트 적용 (POST /api/bookmarks/{foodId})
 * 서버 응답 전 즉시 UI에 반영하고, 실패 시 롤백합니다.
 * @author Antigravity
 */
export const useAddBookmarkMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (foodId: string) => userEndpoints.addBookmark(foodId),
    onMutate: async (foodId: string) => {
      await queryClient.cancelQueries({ queryKey: bookmarkKeys.list() });
      await queryClient.cancelQueries({ queryKey: [...foodKeys.detail(foodId), 'raw'] });

      const previousList = queryClient.getQueryData<TBookmarkListResponse>(bookmarkKeys.list());
      const previousRawDetail = queryClient.getQueryData<TFoodDetailResponse>([...foodKeys.detail(foodId), 'raw']);

      // 낙관적으로 목록에 임시 항목 추가 및 totalCount 1 증가
      queryClient.setQueryData<TBookmarkListResponse>(bookmarkKeys.list(), (old) => {
        if (!old) {
          return {
            totalCount: 1,
            bookmarks: [{ foodId, foodName: '', category: '', features: [], foodPicture: '' }],
          };
        }
        return {
          totalCount: old.totalCount + 1,
          bookmarks: [
            ...old.bookmarks,
            { foodId, foodName: '', category: '', features: [], foodPicture: '' },
          ],
        };
      });

      // 낙관적으로 상세 정보 북마크 상태를 true로 설정
      if (previousRawDetail) {
        queryClient.setQueryData<TFoodDetailResponse>(
          [...foodKeys.detail(foodId), 'raw'],
          {
            ...previousRawDetail,
            isBookmarked: true,
          }
        );
      }

      return { previousList, previousRawDetail };
    },
    onError: (_err, foodId, context) => {
      // 실패 시 이전 상태로 롤백
      if (context?.previousList) {
        queryClient.setQueryData(bookmarkKeys.list(), context.previousList);
      }
      if (context?.previousRawDetail) {
        queryClient.setQueryData([...foodKeys.detail(foodId), 'raw'], context.previousRawDetail);
      }
    },
    onSettled: (_data, _error, foodId) => {
      queryClient.invalidateQueries({ queryKey: bookmarkKeys.list() });
      queryClient.invalidateQueries({ queryKey: [...foodKeys.detail(foodId), 'raw'] });
    },
  });
};

/**
 * 즐겨찾기 삭제 뮤테이션 훅 — 낙관적 업데이트 적용 (DELETE /api/bookmarks/{foodId})
 * 서버 응답 전 즉시 UI에서 제거하고, 실패 시 롤백합니다.
 * @author Antigravity
 */
export const useDeleteBookmarkMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (foodId: string) => userEndpoints.deleteBookmark(foodId),
    onMutate: async (foodId: string) => {
      await queryClient.cancelQueries({ queryKey: bookmarkKeys.list() });
      await queryClient.cancelQueries({ queryKey: [...foodKeys.detail(foodId), 'raw'] });

      const previousList = queryClient.getQueryData<TBookmarkListResponse>(bookmarkKeys.list());
      const previousRawDetail = queryClient.getQueryData<TFoodDetailResponse>([...foodKeys.detail(foodId), 'raw']);

      // 낙관적으로 목록에서 제거 및 totalCount 감소
      queryClient.setQueryData<TBookmarkListResponse>(bookmarkKeys.list(), (old) => {
        if (!old) {
          return { totalCount: 0, bookmarks: [] };
        }
        const filtered = old.bookmarks.filter((item) => item.foodId !== foodId);
        const removedCount = old.bookmarks.length - filtered.length;
        return {
          totalCount: Math.max(0, old.totalCount - removedCount),
          bookmarks: filtered,
        };
      });

      // 낙관적으로 상세 정보 북마크 상태를 false로 설정
      if (previousRawDetail) {
        queryClient.setQueryData<TFoodDetailResponse>(
          [...foodKeys.detail(foodId), 'raw'],
          {
            ...previousRawDetail,
            isBookmarked: false,
          }
        );
      }

      return { previousList, previousRawDetail };
    },
    onError: (_err, foodId, context) => {
      // 실패 시 이전 상태로 롤백
      if (context?.previousList) {
        queryClient.setQueryData(bookmarkKeys.list(), context.previousList);
      }
      if (context?.previousRawDetail) {
        queryClient.setQueryData([...foodKeys.detail(foodId), 'raw'], context.previousRawDetail);
      }
    },
    onSettled: (_data, _error, foodId) => {
      queryClient.invalidateQueries({ queryKey: bookmarkKeys.list() });
      queryClient.invalidateQueries({ queryKey: [...foodKeys.detail(foodId), 'raw'] });
    },
  });
};
