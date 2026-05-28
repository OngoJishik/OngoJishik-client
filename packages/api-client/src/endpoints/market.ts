import { apiClient } from '../client';

/**
 * 전통시장 상점 정보 타입
 * @author Antigravity
 */
export type TMarketStore = {
  id: string;
  name: string;
  marketName: string;
  phone?: string;
  linkUrl?: string;
  products: string[];
};

/**
 * 전통시장 관련 API 엔드포인트 객체
 * @author Antigravity
 */
export const marketEndpoints = {
  /**
   * 특정 식재료를 판매하는 전통시장 상점 목록 조회
   * @author Antigravity
   */
  async getMarketStoresForIngredients(ingredients: string[]): Promise<TMarketStore[]> {
    const response = await apiClient.post<TMarketStore[]>('/market/search-by-ingredients', { ingredients });
    return response.data;
  },
};

