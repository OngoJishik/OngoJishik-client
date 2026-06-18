import { FoodCategory } from '@ongo/utils';

/**
 * 전통 음식 기본 정보 타입
 * @author Antigravity
 */
export type TFood = {
  id: string;
  nameKo: string;
  nameLocalized?: string;
  emoji: string;
  imageUrl?: string;
  category: FoodCategory;
  description: string;
  tags: string[];
  source: string;
};

/**
 * 전통 음식 상세 정보 타입
 * @author Antigravity
 */
export type TFoodDetail = TFood & {
  ingredients: string[];
  recipeSteps: TRecipeStep[];
  historyStory?: string;
  literatureQuotes?: TLiteratureQuote[];
  ritualContext?: string;
  healthBenefits?: string;
};

/**
 * 전통 음식 조리 단계 타입
 * @author Antigravity
 */
export type TRecipeStep = {
  stepNumber: number;
  title: string;
  description: string;
};

/**
 * 고문헌 기록 인용 타입
 * @author Antigravity
 */
export type TLiteratureQuote = {
  sourceName: string;
  quoteOriginal: string;
  quoteTranslation?: string;
  era: string;
};

/**
 * 음식 공통 요약 타입 — 즐겨찾기, 추천, 북마크 모든 API에서 공통으로 사용하는 FoodSummaryResponse
 * @author Antigravity
 */
export type TFoodSummaryResponse = {
  foodId: string;
  foodName: string;
  category: string;
  features: string[];
  foodPicture: string;
};

/**
 * 음식 추천 결과 단건 타입 (POST /api/analysis/recommend 응답)
 * FoodSummaryResponse 스키마와 동일 — features: string[]
 * @author Antigravity
 */
export type TRecommendFoodItem = TFoodSummaryResponse;

/**
 * 음식 추천 응답 타입 (POST /api/analysis/recommend)
 * @author Antigravity
 */
export type TRecommendResponse = {
  searchId?: number;
  originalQuery: string;
  extractedFeatures: string[];
  recommendations: TRecommendFoodItem[];
  createdAt?: string;
};

/**
 * 실제 API 음식 역사 타입 (GET /api/analysis/{foodId})
 * @author Antigravity
 */
export type TFoodHistory = {
  origin: string;
  ceremony: string;
};

/**
 * 실제 API 문헌 출처 타입 (GET /api/analysis/{foodId})
 * @author Antigravity
 */
export type TFoodSource = {
  sourceId: string;
  title: string;
  author: string;
  publishYear: string;
  content: string;
  originalUrl: string;
};

/**
 * 실제 API 음식 상세 응답 타입 (GET /api/analysis/{foodId})
 * 백엔드 개선 반영:
 * - ingredient(string) → ingredients(string[])
 * - recipeSteps(string[]) → recipeSteps(TRecipeStep[])
 * - features: string[] (통일)
 * @author Antigravity
 */
export type TFoodDetailResponse = {
  foodId: string;
  foodName: string;
  foodNameTranslated?: string;
  category: string;
  features: string[];
  imageUrl?: string;
  isBookmarked: boolean;
  ingredients: string[];
  recipeSteps: TRecipeStep[];
  history: TFoodHistory;
  literature: { sources: TFoodSource[] };
  dataSource: string;
};
