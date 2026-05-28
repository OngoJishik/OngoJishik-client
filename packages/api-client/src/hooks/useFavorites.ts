import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { userEndpoints } from '../endpoints/user';
import { userKeys, foodKeys } from './queryKeys';

/**
 * 사용자의 즐겨찾기 목록 조회 훅
 * @author Antigravity
 */
export const useFavoritesQuery = () => {
  return useQuery({
    queryKey: userKeys.favorites(),
    queryFn: () => userEndpoints.getFavorites(),
    staleTime: 5 * 60 * 1000, // 5m
    gcTime: 1 * 60 * 60 * 1000, // 1h
  });
};

/**
 * 특정 음식의 즐겨찾기 등록/해제 토글 뮤테이션 훅
 * @author Antigravity
 */
export const useToggleFavoriteMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (foodId: string) => userEndpoints.toggleFavorite(foodId),
    onSuccess: (_, foodId) => {
      queryClient.invalidateQueries({ queryKey: userKeys.favorites() });
      queryClient.invalidateQueries({ queryKey: foodKeys.detail(foodId) });
    },
  });
};

