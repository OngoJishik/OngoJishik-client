/**
 * 커뮤니티 게시판 카테고리 타입
 * @author Antigravity
 */
export type TBoardCategory = 'REVIEW' | 'RECIPE' | 'QNA';

/**
 * 게시글 목록용 요약본 타입 (BoardSummaryResponse)
 * @author Antigravity
 */
export type TBoardSummary = {
  boardId: number;
  title: string;
  imageUrls: string[];
  category: TBoardCategory;
  likeCount: number;
  commentCount: number;
  isLiked: boolean;
  authorId: number;
  authorNickname: string;
  createdAt: string;
};

/**
 * 게시글 상세 정보 타입 (BoardResponse)
 * @author Antigravity
 */
export type TBoard = {
  boardId: number;
  title: string;
  content: string;
  imageUrls: string[];
  category: TBoardCategory;
  recipeId?: string;
  likeCount: number;
  commentCount: number;
  isLiked: boolean;
  authorId: number;
  authorNickname: string;
  createdAt: string;
  updatedAt: string;
};

/**
 * 게시글 생성 요청 타입 (BoardCreateRequest)
 * @author Antigravity
 */
export type TBoardCreateRequest = {
  title: string;
  content: string;
  imageUrls?: string[];
  category: TBoardCategory;
  recipeId?: string;
};

/**
 * 게시글 수정 요청 타입 (BoardUpdateRequest)
 * @author Antigravity
 */
export type TBoardUpdateRequest = TBoardCreateRequest;

/**
 * 게시글 댓글 정보 타입 (CommentResponse)
 * @author Antigravity
 */
export type TComment = {
  commentId: number;
  boardId: number;
  authorId: number;
  authorName: string;
  commentContent: string;
  createdAt: string;
  updatedAt: string;
};

/**
 * 댓글 작성 및 수정 요청 타입 (CommentRequest)
 * @author Antigravity
 */
export type TCommentRequest = {
  commentContent: string;
};

/**
 * 내가 작성한 댓글 정보 타입 (MyCommentResponse)
 * @author Antigravity
 */
export type TMyComment = {
  commentId: number;
  boardId: number;
  boardTitle: string;
  commentContent: string;
  createdAt: string;
  updatedAt: string;
};

/**
 * 좋아요 등록/취소 결과 타입 (BoardLikeResponse)
 * @author Antigravity
 */
export type TLikeResult = {
  boardId: number;
  liked: boolean;
  likeCount: number;
};
