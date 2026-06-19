import { apiClient } from '../client';
import type { THomeResponse } from '../types/home';

/**
 * 홈화면 관련 API 엔드포인트 객체
 * @author Antigravity
 */
export const homeEndpoints = {
  /**
   * 오늘의 추천 전통음식 목록 조회
   * @author Antigravity
   */
  async getTodayFood(): Promise<THomeResponse> {
    const response = await apiClient.get<THomeResponse>('/api/home');
    return response.data;
  },
};
