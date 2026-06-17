/**
 * 즐겨찾기(북마크) 응답 타입 (GET /api/bookmarks, POST /api/bookmarks/{foodId})
 * @author Antigravity
 */
export type TBookmarkResponse = {
  foodId: string;
  foodName: string;
  category: string;
  foodFeature: string;
  foodPicture: string;
};
