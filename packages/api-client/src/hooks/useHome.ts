import { useQuery } from '@tanstack/react-query';
import { homeEndpoints } from '../endpoints/home';
import { homeKeys } from './queryKeys';

/**
 * 오늘의 추천 전통음식 목록 조회 훅 (GET /api/home)
 * @author Antigravity
 */
export const useTodayFoodsQuery = () => {
  return useQuery({
    queryKey: homeKeys.todayFood(),
    queryFn: () => homeEndpoints.getTodayFood(),
    staleTime: 60 * 60 * 1000, // 1 hour
    gcTime: 24 * 60 * 60 * 1000, // 24 hours
  });
};
