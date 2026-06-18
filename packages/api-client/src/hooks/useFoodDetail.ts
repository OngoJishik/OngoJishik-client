import { useQuery } from '@tanstack/react-query';
import { foodEndpoints } from '../endpoints/food';
import { historyEndpoints } from '../endpoints/history';
import { foodKeys, historyKeys } from './queryKeys';
import type { TFoodDetailResponse } from '../types/food';
import type { TFoodDetail } from '../types/food';

/**
 * API 응답(`TFoodDetailResponse`)을 기존 UI 타입(`TFoodDetail`)으로 변환하는 매핑 헬퍼
 * 백엔드 개선 반영: ingredients 배열, recipeSteps 구조체 배열을 직접 사용합니다.
 * @author Antigravity
 */
export const mapFoodDetailResponse = (res: TFoodDetailResponse): TFoodDetail => {
  const ingredients = res.ingredients ?? [];

  const recipeSteps = res.recipeSteps ?? [];

  const literatureQuotes = (res.literature?.sources ?? []).map((src) => ({
    sourceName: src.title,
    quoteOriginal: src.content,
    quoteTranslation: undefined,
    era: src.publishYear,
  }));

  return {
    id: res.foodId,
    nameKo: res.foodName,
    nameLocalized: res.foodNameTranslated,
    emoji: '🍲',
    imageUrl: res.imageUrl,
    category: res.category as TFoodDetail['category'],
    description: res.features?.join(', ') ?? '',
    tags: res.features ?? [],
    source: res.dataSource ?? '',
    ingredients,
    recipeSteps,
    historyStory: res.history?.origin ?? '',
    ritualContext: res.history?.ceremony ?? '',
    literatureQuotes,
  };
};

/**
 * 전통 음식 상세 정보 조회 훅 (GET /api/analysis/{foodId})
 * @author Antigravity
 */
export const useFoodDetailQuery = (foodId: string) => {
  return useQuery({
    queryKey: foodKeys.detail(foodId),
    queryFn: async () => {
      const res = await foodEndpoints.getFoodDetailFromAnalysis(foodId);
      return mapFoodDetailResponse(res);
    },
    enabled: !!foodId,
    staleTime: 24 * 60 * 60 * 1000, // 24h
    gcTime: 7 * 24 * 60 * 60 * 1000, // 7d
  });
};

/**
 * 음식 상세 원본 API 응답 조회 훅 — isBookmarked 등 원본 필드 필요 시 사용
 * @author Antigravity
 */
export const useFoodDetailRawQuery = (foodId: string) => {
  return useQuery({
    queryKey: [...foodKeys.detail(foodId), 'raw'],
    queryFn: () => foodEndpoints.getFoodDetailFromAnalysis(foodId),
    enabled: !!foodId,
    staleTime: 24 * 60 * 60 * 1000, // 24h
    gcTime: 7 * 24 * 60 * 60 * 1000, // 7d
  });
};

/**
 * 전통 음식 역사 스토리 조회 훅 (레거시 - stub)
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


