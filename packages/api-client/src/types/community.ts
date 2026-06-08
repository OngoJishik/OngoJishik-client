/**
 * 작성자 정보 타입
 * @author Antigravity
 */
export type TAuthor = {
  id: string;
  name: string;
  avatarUrl?: string;
};

/**
 * 커뮤니티 게시글 정보 타입
 * @author Antigravity
 */
export type TPost = {
  id: string;
  author: TAuthor;
  createdAt: string;
  category: 'review' | 'recipe' | 'qna';
  images: string[];
  content: string;
  linkedRecipe?: {
    id: string;
    nameKo: string;
    emoji: string;
  };
  likeCount: number;
  commentCount: number;
  isLiked: boolean;
};

/**
 * 게시글 수정 요청 타입
 * @author Antigravity
 */
export type TPostUpdateRequest = {
  category: 'review' | 'recipe' | 'qna';
  content: string;
  images: string[];
  linkedRecipeId?: string;
};

/**
 * 게시글 댓글 정보 타입
 * @author Antigravity
 */
export type TComment = {
  id: string;
  postId: string;
  author: TAuthor;
  content: string;
  createdAt: string;
};

