import { useMutation } from '@tanstack/react-query';
import { authEndpoints } from '../endpoints/auth';

/**
 * 구글 로그인 뮤테이션 훅
 * @author Antigravity
 */
export const useGoogleLoginMutation = () => {
  return useMutation({
    mutationFn: (idToken: string) => authEndpoints.loginWithGoogle(idToken),
  });
};

/**
 * 토큰 갱신 뮤테이션 훅
 * @author Antigravity
 */
export const useRefreshTokenMutation = () => {
  return useMutation({
    mutationFn: (refreshToken: string) => authEndpoints.refreshAuthToken(refreshToken),
  });
};

/**
 * 로그아웃 뮤테이션 훅
 * @author Antigravity
 */
export const useLogoutMutation = () => {
  return useMutation({
    mutationFn: () => authEndpoints.logout(),
  });
};
