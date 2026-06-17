import { apiClient } from '../client';
import type { TSearchHistoryItem, TSearchHistoryList } from '../types/search-history';

/**
 * 검색 기록 관련 API 엔드포인트 객체
 * @author Antigravity
 */
export const searchHistoryEndpoints = {
  /**
   * 최근 검색 기록 목록 조회 (GET /api/searches/recent)
   * @author Antigravity
   */
  async getRecentSearches(): Promise<TSearchHistoryList> {
    const response = await apiClient.get<TSearchHistoryList>('/api/searches/recent');
    return response.data;
  },

  /**
   * 최근 검색 기록 전체 삭제 (DELETE /api/searches/recent)
   * @author Antigravity
   */
  async deleteAllRecentSearches(): Promise<void> {
    await apiClient.delete('/api/searches/recent');
  },

  /**
   * 최근 검색 기록 단건 삭제 (DELETE /api/searches/recent/{searchId})
   * @author Antigravity
   */
  async deleteRecentSearch(searchId: number): Promise<void> {
    await apiClient.delete(`/api/searches/recent/${searchId}`);
  },
};
