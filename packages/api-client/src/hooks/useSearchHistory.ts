import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { searchHistoryEndpoints } from '../endpoints/search-history';
import { searchHistoryKeys } from './queryKeys';

/**
 * 최근 검색 기록 목록 조회 훅 (GET /api/searches/recent)
 * @author Antigravity
 */
export const useSearchHistoryQuery = () => {
  return useQuery({
    queryKey: searchHistoryKeys.list(),
    queryFn: () => searchHistoryEndpoints.getRecentSearches(),
    staleTime: 1 * 60 * 1000, // 1m
    gcTime: 30 * 60 * 1000, // 30m
  });
};

/**
 * 최근 검색 기록 전체 삭제 뮤테이션 훅 (DELETE /api/searches/recent)
 * @author Antigravity
 */
export const useDeleteAllSearchHistoryMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => searchHistoryEndpoints.deleteAllRecentSearches(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: searchHistoryKeys.list() });
    },
  });
};

/**
 * 최근 검색 기록 단건 삭제 뮤테이션 훅 (DELETE /api/searches/recent/{searchId})
 * @author Antigravity
 */
export const useDeleteSearchHistoryMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (searchId: number) => searchHistoryEndpoints.deleteRecentSearch(searchId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: searchHistoryKeys.list() });
    },
  });
};
