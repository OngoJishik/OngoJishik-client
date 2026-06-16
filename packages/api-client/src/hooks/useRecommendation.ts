import { useQuery, useMutation } from '@tanstack/react-query';
import { foodEndpoints } from '../endpoints/food';
import { foodKeys } from './queryKeys';

/**
 * 오늘의 추천 전통 음식 조회 훅 (레거시 - stub)
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
 * 인기 전통 음식 목록 조회 훅 (레거시 - stub)
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

/**
 * 자연어 기반 음식 추천 뮤테이션 훅 (POST /api/analysis/recommend)
 * 사용자 입력 문장을 기반으로 전통 음식 3개를 추천합니다.
 * @author Antigravity
 */
export const useRecommendMutation = () => {
  return useMutation({
    mutationFn: (query: string) => foodEndpoints.getRecommendation(query),
  });
};


