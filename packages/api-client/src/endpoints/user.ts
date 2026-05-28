import { apiClient } from '../client';
import type { TUserProfile } from '../types/common';
import type { TFood } from '../types/food';

/**
 * 사용자 정보 및 개인화 관련 API 엔드포인트 객체
 * @author Antigravity
 */
export const userEndpoints = {
  /**
   * 사용자 프로필 조회
   * @author Antigravity
   */
  async getProfile(): Promise<TUserProfile> {
    const response = await apiClient.get<TUserProfile>('/user/profile');
    return response.data;
  },

  /**
   * 사용자 프로필 수정
   * @author Antigravity
   */
  async updateProfile(data: Partial<TUserProfile>): Promise<TUserProfile> {
    const response = await apiClient.patch<TUserProfile>('/user/profile', data);
    return response.data;
  },

  /**
   * 사용자의 즐겨찾기(전통 음식) 목록 조회
   * @author Antigravity
   */
  async getFavorites(): Promise<TFood[]> {
    const response = await apiClient.get<TFood[]>('/user/favorites');
    return response.data;
  },

  /**
   * 특정 음식의 즐겨찾기 등록/해제 토글
   * @author Antigravity
   */
  async toggleFavorite(foodId: string): Promise<{ isFavorite: boolean }> {
    const response = await apiClient.post<{ isFavorite: boolean }>(`/user/favorites/${foodId}/toggle`);
    return response.data;
  },
};

