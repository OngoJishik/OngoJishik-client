import { apiClient } from '../client';
import type { TUserProfile, TUserLoginResponse } from '../types/common';

/**
 * 인증 관련 API 엔드포인트 객체
 * @author Antigravity
 */
export const authEndpoints = {
  /**
   * 구글 소셜 로그인
   * @author Antigravity
   */
  async loginWithGoogle(idToken: string): Promise<TUserLoginResponse> {
    const response = await apiClient.post<TUserLoginResponse>('/api/users/auth/google', { idToken });
    return response.data;
  },

  /**
   * 로그아웃
   * @author Antigravity
   */
  async logout(refreshToken?: string | null): Promise<void> {
    await apiClient.post('/api/users/auth/logout', refreshToken ? { refreshToken } : {});
  },

  /**
   * 액세스 토큰 갱신
   * @author Antigravity
   */
  async refreshAuthToken(refreshToken: string): Promise<TUserLoginResponse> {
    const response = await apiClient.post<TUserLoginResponse>('/api/users/auth/refresh', { refreshToken });
    return response.data;
  },
};


