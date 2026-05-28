/**
 * API 공통 응답 포맷 타입
 * @author Antigravity
 */
export type TApiResponse<T> = {
  data: T;
  message?: string;
  status: number;
};

/**
 * 페이지네이션 응답 포맷 타입
 * @author Antigravity
 */
export type TPaginatedResponse<T> = {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  hasNext: boolean;
};

/**
 * 유저 프로필 정보 타입
 * @author Antigravity
 */
export type TUserProfile = {
  id: string;
  email: string;
  name: string;
  avatarUrl?: string;
  language: 'ko' | 'en' | 'ja' | 'zh';
  notificationsEnabled: boolean;
};

