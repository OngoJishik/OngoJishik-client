import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { userEndpoints } from '../endpoints/user';
import { bookmarkKeys } from './queryKeys';
import type { TBookmarkResponse } from '../types/bookmark';

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
      const previous = queryClient.getQueryData<TBookmarkResponse[]>(bookmarkKeys.list());
      // 낙관적으로 목록에 임시 항목 추가
      queryClient.setQueryData<TBookmarkResponse[]>(bookmarkKeys.list(), (old = []) => [
        ...old,
        { foodId, foodName: '', category: '', foodFeature: '', foodPicture: '' },
      ]);
      return { previous };
    },
    onError: (_err, _foodId, context) => {
      // 실패 시 이전 상태로 롤백
      if (context?.previous) {
        queryClient.setQueryData(bookmarkKeys.list(), context.previous);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: bookmarkKeys.list() });
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
      const previous = queryClient.getQueryData<TBookmarkResponse[]>(bookmarkKeys.list());
      // 낙관적으로 목록에서 제거
      queryClient.setQueryData<TBookmarkResponse[]>(bookmarkKeys.list(), (old = []) =>
        old.filter((item) => item.foodId !== foodId)
      );
      return { previous };
    },
    onError: (_err, _foodId, context) => {
      // 실패 시 이전 상태로 롤백
      if (context?.previous) {
        queryClient.setQueryData(bookmarkKeys.list(), context.previous);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: bookmarkKeys.list() });
    },
  });
};


