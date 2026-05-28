import { useQuery, useMutation } from '@tanstack/react-query';
import { foodEndpoints } from '../endpoints/food';
import type { TSearchFilters } from '../types/search';
import { foodKeys } from './queryKeys';

/**
 * AI 기반 전통 음식 검색 훅
 * @author Antigravity
 */
export const useSearchQuery = (query: string, filters?: TSearchFilters) => {
  return useQuery({
    queryKey: foodKeys.search(query, filters),
    queryFn: () => foodEndpoints.searchFoods(query, filters),
    enabled: query.trim().length >= 2,
    staleTime: 5 * 60 * 1000, // 5m
    gcTime: 60 * 60 * 1000,   // 1h
  });
};

/**
 * AI 기반 검색어 분석 뮤테이션 훅
 * @author Antigravity
 */
export const useAISearchAnalysisMutation = () => {
  return useMutation({
    mutationFn: (query: string) => foodEndpoints.analyzeSearchAI(query),
  });
};

