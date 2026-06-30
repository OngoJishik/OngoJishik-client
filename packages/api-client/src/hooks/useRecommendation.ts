import { useRef, useEffect, useState } from 'react';
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
    staleTime: 60 * 1000, // 1m
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

/**
 * 이미지 생성 작업 상태 조회 쿼리 훅 (GET /api/analysis/image-jobs/{jobId})
 * 3초 간격으로 폴링하며, 최대 30초 동안 진행합니다.
 * @author Antigravity
 */
export const useImageJobQuery = (jobId: number, enabled: boolean) => {
  const [isTimedOut, setIsTimedOut] = useState(false);
  const startTimeRef = useRef<number | null>(null);

  useEffect(() => {
    if (!enabled) {
      startTimeRef.current = null;
      setIsTimedOut(false);
      return;
    }

    if (startTimeRef.current === null) {
      startTimeRef.current = Date.now();
    }

    const checkTimeout = () => {
      if (startTimeRef.current && Date.now() - startTimeRef.current >= 30000) {
        setIsTimedOut(true);
      }
    };

    const interval = setInterval(checkTimeout, 1000);
    return () => clearInterval(interval);
  }, [jobId, enabled]);

  const queryResult = useQuery({
    queryKey: foodKeys.imageJob(jobId),
    queryFn: () => foodEndpoints.getImageJobStatus(jobId),
    enabled: enabled && !isTimedOut,
    refetchInterval: (query) => {
      const data = query.state.data;
      if (data?.status === 'COMPLETED' || data?.status === 'FAILED' || isTimedOut) {
        return false;
      }
      return 3000;
    },
    staleTime: 0,
    gcTime: 5 * 60 * 1000,
  });

  return {
    ...queryResult,
    isTimedOut,
  };
};


