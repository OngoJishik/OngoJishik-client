import { apiClient } from '../client';
import type { TUserProfile } from '../types/common';

/**
 * 인증 관련 API 엔드포인트 객체
 * @author Antigravity
 */
export const authEndpoints = {
  /**
   * 구글 소셜 로그인
   * @author Antigravity
   */
  async loginWithGoogle(idToken: string): Promise<{ token: string; user: TUserProfile }> {
    const response = await apiClient.post<{ token: string; user: TUserProfile }>('/auth/google', { idToken });
    return response.data;
  },

  /**
   * 로그아웃
   * @author Antigravity
   */
  async logout(): Promise<void> {
    await apiClient.post('/auth/logout');
  },

  /**
   * 액세스 토큰 갱신
   * @author Antigravity
   */
  async refreshAuthToken(): Promise<{ token: string }> {
    const response = await apiClient.post<{ token: string }>('/auth/refresh');
    return response.data;
  },
};

