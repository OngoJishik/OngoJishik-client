import { useQuery } from '@tanstack/react-query';
import { foodEndpoints } from '../endpoints/food';
import { foodKeys } from './queryKeys';

/**
 * 오늘의 추천 전통 음식 조회 훅
 * @author Antigravity
 */
export const useTodayRecommendationQuery = () => {
  return useQuery({
    queryKey: foodKeys.recommendation(),
    queryFn: () => foodEndpoints.getTodayRecommendation(),
    staleTime: 60 * 60 * 1000, // 1h
    gcTime: 24 * 60 * 60 * 1000, // 24h
  });
};

/**
 * 인기 전통 음식 목록 조회 훅
 * @author Antigravity
 */
export const usePopularFoodsQuery = () => {
  return useQuery({
    queryKey: foodKeys.popular(),
    queryFn: () => foodEndpoints.getPopularFoods(),
    staleTime: 10 * 60 * 1000, // 10m
    gcTime: 2 * 60 * 60 * 1000, // 2h
  });
};

