/**
 * 최근 검색 기록 단건 타입 (GET /api/searches/recent)
 * @author Antigravity
 */
export type TSearchHistoryItem = {
  searchId: number;
  query: string;
  createdAt: string;
};

/**
 * 최근 검색 기록 목록 응답 타입 (GET /api/searches/recent)
 * @author Antigravity
 */
export type TSearchHistoryList = {
  totalCount: number;
  searches: TSearchHistoryItem[];
};

