import { apiClient } from '../client';
import type {
  TBoardSummary,
  TBoard,
  TBoardCreateRequest,
  TBoardUpdateRequest,
  TComment,
  TCommentRequest,
  TMyComment,
  TLikeResult,
} from '../types/community';
import type { TPage } from '../types/common';

/**
 * 커뮤니티 관련 API 엔드포인트 객체
 * @author Antigravity
 */
export const communityEndpoints = {
  /**
   * 커뮤니티 게시글 목록 조회 (페이징)
   * @author Antigravity
   */
  async getBoards(
    page: number = 0,
    size: number = 10,
    sortBy: string = 'createdAt',
    direction: 'ASC' | 'DESC' = 'DESC'
  ): Promise<TPage<TBoardSummary>> {
    const response = await apiClient.get<TPage<TBoardSummary>>('/api/boards', {
      params: { page, size, sortBy, direction },
    });
    return response.data;
  },

  /**
   * 게시글 제목 검색 (페이징)
   * @author Antigravity
   */
  async searchBoards(
    title: string,
    page: number = 0,
    size: number = 10,
    sortBy: string = 'createdAt',
    direction: 'ASC' | 'DESC' = 'DESC'
  ): Promise<TPage<TBoardSummary>> {
    const response = await apiClient.get<TPage<TBoardSummary>>('/api/boards/search', {
      params: { title, page, size, sortBy, direction },
    });
    return response.data;
  },

  /**
   * 게시글 상세 정보 조회
   * @author Antigravity
   */
  async getBoardDetail(boardId: number): Promise<TBoard> {
    const response = await apiClient.get<TBoard>(`/api/boards/${boardId}`);
    return response.data;
  },

  /**
   * 새 게시글 작성
   * @author Antigravity
   */
  async createBoard(data: TBoardCreateRequest): Promise<TBoard> {
    const response = await apiClient.post<TBoard>('/api/boards', data);
    return response.data;
  },

  /**
   * 게시글 수정
   * @author Antigravity
   */
  async updateBoard(boardId: number, data: TBoardUpdateRequest): Promise<TBoard> {
    const response = await apiClient.patch<TBoard>(`/api/boards/${boardId}`, data);
    return response.data;
  },

  /**
   * 게시글 삭제
   * @author Antigravity
   */
  async deleteBoard(boardId: number): Promise<void> {
    await apiClient.delete(`/api/boards/${boardId}`);
  },

  /**
   * 게시글별 댓글 목록 조회 (페이징)
   * @author Antigravity
   */
  async getComments(boardId: number, page: number = 0, size: number = 10): Promise<TPage<TComment>> {
    const response = await apiClient.get<TPage<TComment>>(`/api/boards/${boardId}/comments`, {
      params: { page, size },
    });
    return response.data;
  },

  /**
   * 게시글 댓글 작성
   * @author Antigravity
   */
  async createComment(boardId: number, data: TCommentRequest): Promise<TComment> {
    const response = await apiClient.post<TComment>(`/api/boards/${boardId}/comments`, data);
    return response.data;
  },

  /**
   * 댓글 수정
   * @author Antigravity
   */
  async updateComment(commentId: number, data: TCommentRequest): Promise<TComment> {
    const response = await apiClient.patch<TComment>(`/api/comments/${commentId}`, data);
    return response.data;
  },

  /**
   * 댓글 삭제
   * @author Antigravity
   */
  async deleteComment(commentId: number): Promise<void> {
    await apiClient.delete(`/api/comments/${commentId}`);
  },

  /**
   * 내가 작성한 댓글 목록 조회 (페이징)
   * @author Antigravity
   */
  async getMyComments(page: number = 0, size: number = 10): Promise<TPage<TMyComment>> {
    const response = await apiClient.get<TPage<TMyComment>>('/api/comments/me', {
      params: { page, size },
    });
    return response.data;
  },

  /**
   * 게시글 좋아요 토글
   * @author Antigravity
   */
  async toggleLike(boardId: number): Promise<TLikeResult> {
    const response = await apiClient.post<TLikeResult>(`/api/boards/${boardId}/likes`);
    return response.data;
  },

  /**
   * 게시글 좋아요 개수 조회
   * @author Antigravity
   */
  async getLikeCount(boardId: number): Promise<number> {
    const response = await apiClient.get<number>(`/api/boards/${boardId}/likes/count`);
    return response.data;
  },
};


