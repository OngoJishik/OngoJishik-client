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

