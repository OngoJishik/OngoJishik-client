import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { communityEndpoints } from '../endpoints/community';
import { communityKeys } from './queryKeys';

/**
 * 커뮤니티 피드 목록 조회 훅
 * @author Antigravity
 */
export const useCommunityFeedQuery = (category?: string, page: number = 1) => {
  return useQuery({
    queryKey: communityKeys.feed(category, page),
    queryFn: () => communityEndpoints.getFeed(category, page),
    staleTime: 30 * 1000, // 30s
    gcTime: 5 * 60 * 1000, // 5m
  });
};

/**
 * 커뮤니티 게시글 상세 조회 훅
 * @author Antigravity
 */
export const usePostDetailQuery = (postId: string) => {
  return useQuery({
    queryKey: communityKeys.post(postId),
    queryFn: () => communityEndpoints.getPostDetail(postId),
    enabled: !!postId,
  });
};

/**
 * 게시글 작성 뮤테이션 훅
 * @author Antigravity
 */
export const useCreatePostMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: communityEndpoints.createPost,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: communityKeys.feeds() });
    },
  });
};

/**
 * 게시글 좋아요 토글 뮤테이션 훅
 * @author Antigravity
 */
export const useToggleLikeMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: communityEndpoints.likePost,
    onSuccess: (_, postId) => {
      queryClient.invalidateQueries({ queryKey: communityKeys.post(postId) });
      queryClient.invalidateQueries({ queryKey: communityKeys.feeds() });
    },
  });
};

/**
 * 게시글 댓글 목록 조회 훅
 * @author Antigravity
 */
export const usePostCommentsQuery = (postId: string) => {
  return useQuery({
    queryKey: communityKeys.comments(postId),
    queryFn: () => communityEndpoints.getComments(postId),
    enabled: !!postId,
  });
};

/**
 * 댓글 추가 뮤테이션 훅
 * @author Antigravity
 */
export const useAddCommentMutation = (postId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (content: string) => communityEndpoints.addComment(postId, content),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: communityKeys.comments(postId) });
      queryClient.invalidateQueries({ queryKey: communityKeys.post(postId) });
    },
  });
};

