/**
 * 즐겨찾기(북마크) 응답 타입 (GET /api/bookmarks, POST /api/bookmarks/{foodId})
 * 백엔드 개선 반영: foodFeature(string) → features(string[])
 * FoodSummaryResponse 공통 스키마 적용
 * @author Antigravity
 */
export type TBookmarkResponse = {
  foodId: string;
  foodName: string;
  category: string;
  features: string[];
  foodPicture: string;
};

/**
 * 게시글 작성/수정 시 recipeId로 선택 가능한 북마크 음식의 레시피 정보
 * GET /api/bookmarks/recipes 응답 (BookmarkedRecipeResponse)
 * @author Antigravity
 */
export type TBookmarkedRecipe = {
  recipeId: string;
  foodName: string;
  foodPicture: string;
  recipe: string;
};
