import { apiClient } from '../client';
import type { TFood, TFoodDetail, TRecommendResponse, TFoodDetailResponse, TImageJobResponse } from '../types/food';
import type { TSearchFilters, TAiSearchAnalysis } from '../types/search';

/**
 * 음식 관련 API 엔드포인트 객체
 * @author Antigravity
 */
export const foodEndpoints = {
  /**
   * 전통 음식 검색 (레거시 - stub)
   * @author Antigravity
   */
  async searchFoods(query: string, filters?: TSearchFilters): Promise<TFood[]> {
    const response = await apiClient.get<TFood[]>('/foods/search', {
      params: { q: query, ...filters },
    });
    return response.data;
  },

  /**
   * AI 기반 검색어 분석 (레거시 - stub)
   * @author Antigravity
   */
  async analyzeSearchAI(query: string): Promise<TAiSearchAnalysis> {
    const response = await apiClient.post<TAiSearchAnalysis>('/foods/search/ai-analyze', { query });
    return response.data;
  },

  /**
   * 자연어 기반 음식 추천 (POST /api/analysis/recommend)
   * 사용자 입력 문장을 기반으로 전통 음식 3개를 추천합니다.
   * @author Antigravity
   */
  async getRecommendation(query: string): Promise<TRecommendResponse> {
    const response = await apiClient.post<TRecommendResponse>('/api/analysis/recommend', { query });
    return response.data;
  },

  /**
   * 이미지 생성 작업 상태 조회 (GET /api/analysis/image-jobs/{jobId})
   * @author Antigravity
   */
  async getImageJobStatus(jobId: number): Promise<TImageJobResponse> {
    const response = await apiClient.get<TImageJobResponse>(`/api/analysis/image-jobs/${jobId}`);
    return response.data;
  },

  /**
   * 추천 음식 상세 정보 조회 (GET /api/analysis/{foodId})
   * @author Antigravity
   */
  async getFoodDetailFromAnalysis(foodId: string): Promise<TFoodDetailResponse> {
    const response = await apiClient.get<TFoodDetailResponse>(`/api/analysis/${foodId}`);
    return response.data;
  },

  /**
   * 전통 음식 상세 정보 조회 (레거시 - stub)
   * @author Antigravity
   */
  async getFoodDetail(id: string): Promise<TFoodDetail> {
    const response = await apiClient.get<TFoodDetail>(`/foods/${id}`);
    return response.data;
  },

  /**
   * 오늘의 추천 음식 조회 (레거시 - stub)
   * @author Antigravity
   */
  async getTodayRecommendation(): Promise<TFoodDetail> {
    const response = await apiClient.get<TFoodDetail>('/foods/recommendations/today');
    return response.data;
  },

  /**
   * 인기 전통 음식 목록 조회 (레거시 - stub)
   * @author Antigravity
   */
  async getPopularFoods(): Promise<TFood[]> {
    const response = await apiClient.get<TFood[]>('/foods/popular');
    return response.data;
  },
};

