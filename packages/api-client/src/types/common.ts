/**
 * API 공통 응답 포맷 타입
 * @author Antigravity
 */
export type TApiResponse<T> = {
  success: boolean;
  code: number;
  message: string;
  data: T;
};

/**
 * Spring Page 응답 포맷 타입
 * @author Antigravity
 */
export type TPage<T> = {
  content: T[];
  totalElements: number;
  totalPages: number;
  number: number; // 0-based 현재 페이지
  size: number;
  first: boolean;
  last: boolean;
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
  postCount?: number;
};

