import { useQuery, useInfiniteQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { communityEndpoints } from '../endpoints/community';
import { communityKeys } from './queryKeys';
import type { TBoardCategory, TBoardUpdateRequest, TBoardCreateRequest, TComment } from '../types/community';
import type { TPage } from '../types/common';

/**
 * 커뮤니티 게시글 목록 무한 스크롤 조회 훅
 * @author Antigravity
 */
export const useBoardsInfiniteQuery = (size: number = 10, category?: TBoardCategory) => {
  return useInfiniteQuery({
    queryKey: communityKeys.boardList(undefined, size, category),
    queryFn: ({ pageParam = 0 }) => communityEndpoints.getBoards(pageParam, size, 'createdAt', 'DESC', category),
    initialPageParam: 0,
    getNextPageParam: (lastPage) => (lastPage.last ? undefined : lastPage.number + 1),
    staleTime: 30 * 1000, // 30s
    gcTime: 5 * 60 * 1000, // 5m
  });
};

/**
 * 게시글 제목 검색 훅
 * @author Antigravity
 */
export const useSearchBoardsQuery = (
  title: string,
  page: number = 0,
  size: number = 10,
  category?: TBoardCategory
) => {
  return useQuery({
    queryKey: communityKeys.boardSearch(title, page, category),
    queryFn: () => communityEndpoints.searchBoards(title, page, size, 'createdAt', 'DESC', category),
    enabled: !!title,
  });
};

/**
 * 게시글 상세 조회 훅
 * @author Antigravity
 */
export const useBoardDetailQuery = (boardId: number) => {
  return useQuery({
    queryKey: communityKeys.boardDetail(boardId),
    queryFn: () => communityEndpoints.getBoardDetail(boardId),
    enabled: !isNaN(boardId) && boardId > 0,
  });
};

/**
 * 게시글 작성 뮤테이션 훅
 * @author Antigravity
 */
export const useCreateBoardMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: TBoardCreateRequest) => communityEndpoints.createBoard(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: communityKeys.boards() });
    },
  });
};

/**
 * 게시글 수정 뮤테이션 훅
 * @author Antigravity
 */
export const useUpdateBoardMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ boardId, data }: { boardId: number; data: TBoardUpdateRequest }) =>
      communityEndpoints.updateBoard(boardId, data),
    onSuccess: (_, { boardId }) => {
      queryClient.invalidateQueries({ queryKey: communityKeys.boardDetail(boardId) });
      queryClient.invalidateQueries({ queryKey: communityKeys.boards() });
    },
  });
};

/**
 * 게시글 삭제 뮤테이션 훅
 * @author Antigravity
 */
export const useDeleteBoardMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (boardId: number) => communityEndpoints.deleteBoard(boardId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: communityKeys.boards() });
    },
  });
};

/**
 * 내가 작성한 게시글 목록 무한 스크롤 조회 훅
 * @author Antigravity
 */
export const useMyBoardsInfiniteQuery = (size: number = 10) => {
  return useInfiniteQuery({
    queryKey: communityKeys.myBoards(undefined, size),
    queryFn: ({ pageParam = 0 }) => communityEndpoints.getMyBoards(pageParam, size),
    initialPageParam: 0,
    getNextPageParam: (lastPage) => (lastPage.last ? undefined : lastPage.number + 1),
    staleTime: 30 * 1000, // 30s
    gcTime: 5 * 60 * 1000, // 5m
  });
};

/**
 * 게시글별 댓글 목록 조회 훅
 * @author Antigravity
 */
export const useBoardCommentsQuery = (boardId: number, page: number = 0, size: number = 20) => {
  return useQuery({
    queryKey: communityKeys.comments(boardId, page),
    queryFn: () => communityEndpoints.getComments(boardId, page, size),
    enabled: !isNaN(boardId) && boardId > 0,
  });
};

/**
 * 댓글 추가 뮤테이션 훅
 * @author Antigravity
 */
export const useAddCommentMutation = (boardId: number) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ content }: { content: string; authorName?: string }) =>
      communityEndpoints.createComment(boardId, { commentContent: content }),
    onMutate: async ({ content, authorName = '익명' }) => {
      await queryClient.cancelQueries({ queryKey: communityKeys.comments(boardId) });
      const previousComments = queryClient.getQueryData<TPage<TComment>>(communityKeys.comments(boardId, 0));

      if (previousComments) {
        const newComment: TComment = {
          commentId: -Date.now(),
          boardId,
          authorId: 0,
          authorName,
          commentContent: content,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };

        queryClient.setQueryData<TPage<TComment>>(communityKeys.comments(boardId, 0), {
          ...previousComments,
          content: [...previousComments.content, newComment],
          totalElements: previousComments.totalElements + 1,
        });
      }

      return { previousComments };
    },
    onError: (err, variables, context) => {
      if (context?.previousComments) {
        queryClient.setQueryData(communityKeys.comments(boardId, 0), context.previousComments);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: communityKeys.comments(boardId) });
    },
  });
};

/**
 * 댓글 수정 뮤테이션 훅
 * @author Antigravity
 */
export const useUpdateCommentMutation = (boardId: number) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ commentId, content }: { commentId: number; content: string }) =>
      communityEndpoints.updateComment(commentId, { commentContent: content }),
    onMutate: async ({ commentId, content }) => {
      await queryClient.cancelQueries({ queryKey: communityKeys.comments(boardId) });
      const previousComments = queryClient.getQueryData<TPage<TComment>>(communityKeys.comments(boardId, 0));

      if (previousComments) {
        const updatedContent = previousComments.content.map((c) =>
          c.commentId === commentId ? { ...c, commentContent: content, updatedAt: new Date().toISOString() } : c
        );
        queryClient.setQueryData<TPage<TComment>>(communityKeys.comments(boardId, 0), {
          ...previousComments,
          content: updatedContent,
        });
      }

      return { previousComments };
    },
    onError: (err, variables, context) => {
      if (context?.previousComments) {
        queryClient.setQueryData(communityKeys.comments(boardId, 0), context.previousComments);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: communityKeys.comments(boardId) });
    },
  });
};

/**
 * 댓글 삭제 뮤테이션 훅
 * @author Antigravity
 */
export const useDeleteCommentMutation = (boardId: number) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (commentId: number) => communityEndpoints.deleteComment(commentId),
    onMutate: async (commentId) => {
      await queryClient.cancelQueries({ queryKey: communityKeys.comments(boardId) });
      const previousComments = queryClient.getQueryData<TPage<TComment>>(communityKeys.comments(boardId, 0));

      if (previousComments) {
        const updatedContent = previousComments.content.filter((c) => c.commentId !== commentId);
        queryClient.setQueryData<TPage<TComment>>(communityKeys.comments(boardId, 0), {
          ...previousComments,
          content: updatedContent,
          totalElements: Math.max(0, previousComments.totalElements - 1),
        });
      }

      return { previousComments };
    },
    onError: (err, variables, context) => {
      if (context?.previousComments) {
        queryClient.setQueryData(communityKeys.comments(boardId, 0), context.previousComments);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: communityKeys.comments(boardId) });
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
    mutationFn: ({ boardId }: { boardId: number; currentLiked?: boolean }) =>
      communityEndpoints.toggleLike(boardId),
    onMutate: async ({ boardId, currentLiked }) => {
      if (currentLiked === undefined) return;
      await queryClient.cancelQueries({ queryKey: communityKeys.likeCount(boardId) });
      const previousLikeCount = queryClient.getQueryData<number>(communityKeys.likeCount(boardId));

      if (previousLikeCount !== undefined) {
        const nextLikeCount = currentLiked
          ? Math.max(0, previousLikeCount - 1)
          : previousLikeCount + 1;
        queryClient.setQueryData<number>(communityKeys.likeCount(boardId), nextLikeCount);
      }

      return { previousLikeCount };
    },
    onError: (err, variables, context) => {
      if (context?.previousLikeCount !== undefined) {
        queryClient.setQueryData(communityKeys.likeCount(variables.boardId), context.previousLikeCount);
      }
    },
    onSettled: (data, error, variables) => {
      queryClient.invalidateQueries({ queryKey: communityKeys.likeCount(variables.boardId) });
      queryClient.invalidateQueries({ queryKey: communityKeys.boardDetail(variables.boardId) });
    },
  });
};

/**
 * 게시글 좋아요 개수 조회 훅
 * @author Antigravity
 */
export const useLikeCountQuery = (boardId: number) => {
  return useQuery({
    queryKey: communityKeys.likeCount(boardId),
    queryFn: () => communityEndpoints.getLikeCount(boardId),
    enabled: !isNaN(boardId) && boardId > 0,
  });
};

/**
 * 내가 작성한 댓글 목록 조회 훅
 * @author Antigravity
 */
export const useMyCommentsQuery = (page: number = 0, size: number = 20) => {
  return useQuery({
    queryKey: communityKeys.myComments(page),
    queryFn: () => communityEndpoints.getMyComments(page, size),
  });
};

/**
 * 내가 작성한 게시글 페이지 조회 훅 (무한 스크롤 없는 단순 페이지 버전)
 * size=1로 호출하면 totalElements만 효율적으로 조회할 수 있습니다.
 * @author Antigravity
 */
export const useMyBoardsQuery = (page: number = 0, size: number = 10) => {
  return useQuery({
    queryKey: communityKeys.myBoards(page, size),
    queryFn: () => communityEndpoints.getMyBoards(page, size),
    staleTime: 60 * 1000, // 1m
  });
};
