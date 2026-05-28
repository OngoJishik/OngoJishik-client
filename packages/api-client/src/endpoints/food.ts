import { apiClient } from '../client';
import type { TFood, TFoodDetail } from '../types/food';
import type { TSearchFilters, TAiSearchAnalysis } from '../types/search';

/**
 * 음식 관련 API 엔드포인트 객체
 * @author Antigravity
 */
export const foodEndpoints = {
  /**
   * 전통 음식 검색
   * @author Antigravity
   */
  async searchFoods(query: string, filters?: TSearchFilters): Promise<TFood[]> {
    const response = await apiClient.get<TFood[]>('/foods/search', {
      params: { q: query, ...filters },
    });
    return response.data;
  },

  /**
   * AI 기반 검색어 분석
   * @author Antigravity
   */
  async analyzeSearchAI(query: string): Promise<TAiSearchAnalysis> {
    const response = await apiClient.post<TAiSearchAnalysis>('/foods/search/ai-analyze', { query });
    return response.data;
  },

  /**
   * 전통 음식 상세 정보 조회
   * @author Antigravity
   */
  async getFoodDetail(id: string): Promise<TFoodDetail> {
    const response = await apiClient.get<TFoodDetail>(`/foods/${id}`);
    return response.data;
  },

  /**
   * 오늘의 추천 음식 조회
   * @author Antigravity
   */
  async getTodayRecommendation(): Promise<TFoodDetail> {
    const response = await apiClient.get<TFoodDetail>('/foods/recommendations/today');
    return response.data;
  },

  /**
   * 인기 전통 음식 목록 조회
   * @author Antigravity
   */
  async getPopularFoods(): Promise<TFood[]> {
    const response = await apiClient.get<TFood[]>('/foods/popular');
    return response.data;
  },
};

