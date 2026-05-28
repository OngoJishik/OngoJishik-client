import { useQuery } from '@tanstack/react-query';
import { foodEndpoints } from '../endpoints/food';
import { historyEndpoints } from '../endpoints/history';
import { foodKeys, historyKeys } from './queryKeys';

/**
 * 전통 음식 상세 정보 조회 훅
 * @author Antigravity
 */
export const useFoodDetailQuery = (foodId: string) => {
  return useQuery({
    queryKey: foodKeys.detail(foodId),
    queryFn: () => foodEndpoints.getFoodDetail(foodId),
    enabled: !!foodId,
    staleTime: 24 * 60 * 60 * 1000, // 24h
    gcTime: 7 * 24 * 60 * 60 * 1000, // 7d
  });
};

/**
 * 전통 음식 역사 스토리 조회 훅
 * @author Antigravity
 */
export const useFoodHistoryStoryQuery = (foodId: string) => {
  return useQuery({
    queryKey: historyKeys.story(foodId),
    queryFn: () => historyEndpoints.getHistoryStory(foodId),
    enabled: !!foodId,
    staleTime: 7 * 24 * 60 * 60 * 1000, // 7d
    gcTime: 30 * 24 * 60 * 60 * 1000, // 30d
  });
};

