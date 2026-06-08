import { apiClient } from '../client';
import type { TPost, TComment, TPostUpdateRequest } from '../types/community';
import type { TPaginatedResponse } from '../types/common';

/**
 * 커뮤니티 관련 API 엔드포인트 객체
 * @author Antigravity
 */
export const communityEndpoints = {
  /**
   * 커뮤니티 피드 목록 조회 (페이징 지원)
   * @author Antigravity
   */
  async getFeed(category?: string, page: number = 1): Promise<TPaginatedResponse<TPost>> {
    const response = await apiClient.get<TPaginatedResponse<TPost>>('/community/feed', {
      params: { category, page },
    });
    return response.data;
  },

  /**
   * 커뮤니티 게시글 상세 정보 조회
   * @author Antigravity
   */
  async getPostDetail(postId: string): Promise<TPost> {
    const response = await apiClient.get<TPost>(`/community/posts/${postId}`);
    return response.data;
  },

  /**
   * 새 게시글 작성
   * @author Antigravity
   */
  async createPost(data: {
    category: 'review' | 'recipe' | 'qna';
    content: string;
    images: string[];
    linkedRecipeId?: string;
  }): Promise<TPost> {
    const response = await apiClient.post<TPost>('/community/posts', data);
    return response.data;
  },

  /**
   * 게시글 좋아요 토글
   * @author Antigravity
   */
  async likePost(postId: string): Promise<{ likeCount: number; isLiked: boolean }> {
    const response = await apiClient.post<{ likeCount: number; isLiked: boolean }>(`/community/posts/${postId}/like`);
    return response.data;
  },

  /**
   * 게시글 수정
   * @author Antigravity
   */
  async updatePost(postId: string, data: TPostUpdateRequest): Promise<TPost> {
    const response = await apiClient.put<TPost>(`/community/posts/${postId}`, data);
    return response.data;
  },

  /**
   * 게시글 삭제
   * @author Antigravity
   */
  async deletePost(postId: string): Promise<void> {
    await apiClient.delete(`/community/posts/${postId}`);
  },

  /**
   * 게시글에 달린 댓글 목록 조회
   * @author Antigravity
   */
  async getComments(postId: string): Promise<TComment[]> {
    const response = await apiClient.get<TComment[]>(`/community/posts/${postId}/comments`);
    return response.data;
  },

  /**
   * 게시글 댓글 추가
   * @author Antigravity
   */
  async addComment(postId: string, content: string): Promise<TComment> {
    const response = await apiClient.post<TComment>(`/community/posts/${postId}/comments`, { content });
    return response.data;
  },

  /**
   * 댓글 수정
   * @author Antigravity
   */
  async updateComment(postId: string, commentId: string, content: string): Promise<TComment> {
    const response = await apiClient.put<TComment>(
      `/community/posts/${postId}/comments/${commentId}`,
      { content },
    );
    return response.data;
  },

  /**
   * 댓글 삭제
   * @author Antigravity
   */
  async deleteComment(postId: string, commentId: string): Promise<void> {
    await apiClient.delete(`/community/posts/${postId}/comments/${commentId}`);
  },
};

