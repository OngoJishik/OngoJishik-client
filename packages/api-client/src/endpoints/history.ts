import { apiClient } from '../client';
import type { TLiteratureQuote } from '../types/food';

/**
 * 역사 및 문헌 기록 관련 API 엔드포인트 객체
 * @author Antigravity
 */
export const historyEndpoints = {
  /**
   * 음식의 역사적 배경 스토리 조회
   * @author Antigravity
   */
  async getHistoryStory(foodId: string): Promise<{ story: string; era: string }> {
    const response = await apiClient.get<{ story: string; era: string }>(`/history/${foodId}`);
    return response.data;
  },

  /**
   * 음식에 관한 고문헌 인용구 목록 조회
   * @author Antigravity
   */
  async getLiteratureQuotes(foodId: string): Promise<TLiteratureQuote[]> {
    const response = await apiClient.get<TLiteratureQuote[]>(`/history/${foodId}/literature`);
    return response.data;
  },
};

