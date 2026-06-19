/**
 * 홈화면 오늘의 추천 전통음식 개별 데이터 스키마
 * @author Antigravity
 */
export type THomeFoodResponse = {
  order: number;
  foodId: string;
  foodName: string;
  category: string;
  features: string[];
  foodPicture: string;
};

/**
 * 홈화면 오늘의 추천 전통음식 전체 목록 API 응답 타입
 * @author Antigravity
 */
export type THomeResponse = {
  foods: THomeFoodResponse[];
};
