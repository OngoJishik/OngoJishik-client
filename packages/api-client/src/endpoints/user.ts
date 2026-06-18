import { apiClient } from '../client';
import type { TUserProfile } from '../types/common';
import type { TBookmarkResponse, TBookmarkedRecipe } from '../types/bookmark';

/**
 * 사용자 정보 및 즐겨찾기 관련 API 엔드포인트 객체
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
   * 내 즐겨찾기(북마크) 목록 조회 (GET /api/bookmarks)
   * @author Antigravity
   */
  async getBookmarks(): Promise<TBookmarkResponse[]> {
    const response = await apiClient.get<TBookmarkResponse[]>('/api/bookmarks');
    return response.data;
  },

  /**
   * 게시글 작성/수정 시 recipeId로 선택 가능한 북마크 음식 레시피 목록 조회
   * (GET /api/bookmarks/recipes)
   * @author Antigravity
   */
  async getBookmarkedRecipes(): Promise<TBookmarkedRecipe[]> {
    const response = await apiClient.get<TBookmarkedRecipe[]>('/api/bookmarks/recipes');
    return response.data;
  },

  /**
   * 음식 즐겨찾기 추가 (POST /api/bookmarks/{foodId})
   * @author Antigravity
   */
  async addBookmark(foodId: string): Promise<TBookmarkResponse> {
    const response = await apiClient.post<TBookmarkResponse>(`/api/bookmarks/${foodId}`);
    return response.data;
  },

  /**
   * 음식 즐겨찾기 삭제 (DELETE /api/bookmarks/{foodId})
   * @author Antigravity
   */
  async deleteBookmark(foodId: string): Promise<void> {
    await apiClient.delete(`/api/bookmarks/${foodId}`);
  },
};
