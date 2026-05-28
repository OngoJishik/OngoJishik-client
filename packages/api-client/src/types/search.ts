import { FoodCategory } from '@ongo/utils';

/**
 * 검색 필터 조건 타입
 * @author Antigravity
 */
export type TSearchFilters = {
  category?: FoodCategory;
  spicyLevel?: 'none' | 'mild' | 'spicy';
  era?: string;
};

/**
 * 검색 질의 타입
 * @author Antigravity
 */
export type TSearchQuery = {
  query: string;
  filters?: TSearchFilters;
};

/**
 * AI 검색 분석 결과 타입
 * @author Antigravity
 */
export type TAiSearchAnalysis = {
  detectedFlavor?: string;
  detectedColor?: string;
  detectedCategory?: string;
};

