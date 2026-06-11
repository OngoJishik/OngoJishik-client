/**
 * 커뮤니티 게시판 카테고리 타입
 * @author Antigravity
 */
export type TBoardCategory = 'review' | 'recipe' | 'qna';

/**
 * 게시글 목록용 요약본 타입
 * @author Antigravity
 */
export type TBoardSummary = {
  boardId: number;
  title: string;
  imageUrl?: string; // JSON string representation of string[]
  authorId: number;
  authorNickname: string;
  createdAt: string;
  category?: TBoardCategory; // Optional for future backend support
};

/**
 * 게시글 상세 정보 타입
 * @author Antigravity
 */
export type TBoard = {
  boardId: number;
  title: string;
  content: string;
  imageUrl?: string; // JSON string representation of string[]
  authorId: number;
  authorNickname: string;
  createdAt: string;
  updatedAt: string;
  category?: TBoardCategory; // Optional for future backend support
  linkedRecipe?: {
    id: string;
    nameKo: string;
    emoji: string;
  }; // Optional for future backend support
  isLiked?: boolean; // Optional for future backend support
};

/**
 * 게시글 생성 요청 타입
 * @author Antigravity
 */
export type TBoardCreateRequest = {
  title: string;
  content: string;
  imageUrl?: string; // JSON string representation of string[]
  category?: TBoardCategory; // Optional for future backend support
  linkedRecipeId?: string; // Optional for future backend support
};

/**
 * 게시글 수정 요청 타입
 * @author Antigravity
 */
export type TBoardUpdateRequest = TBoardCreateRequest;

/**
 * 게시글 댓글 정보 타입
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
 * 댓글 작성 및 수정 요청 타입
 * @author Antigravity
 */
export type TCommentRequest = {
  commentContent: string;
};

/**
 * 내가 작성한 댓글 정보 타입
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
 * 좋아요 등록/취소 결과 타입
 * @author Antigravity
 */
export type TLikeResult = {
  boardId: number;
  liked: boolean;
  likeCount: number;
};


