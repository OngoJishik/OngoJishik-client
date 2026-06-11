import React, { useState, useEffect } from 'react';
import { View, StyleSheet, FlatList, KeyboardAvoidingView, Platform, Pressable } from 'react-native';
import { useLocalSearchParams, useRouter, Href } from 'expo-router';
import { useAtomValue } from 'jotai';

import { useTranslation } from '@ongo/i18n';
import {
  ScreenLayout,
  Header,
  PostDetail,
  CommentInput,
  Text,
  useTheme,
} from '@ongo/ui';
import { userProfileAtom } from '@ongo/store';
import {
  useBoardDetailQuery,
  useDeleteBoardMutation,
  useBoardCommentsQuery,
  useAddCommentMutation,
  useUpdateCommentMutation,
  useDeleteCommentMutation,
  useToggleLikeMutation,
  useLikeCountQuery,
} from '@ongo/api-client';

import { CommentItem } from './components/CommentItem';
import { PostMoreMenu } from './components/PostMoreMenu';
import { MOCK_POSTS, MOCK_COMMENTS } from '../../mocks';
import type { TBoardCategory } from '@ongo/api-client';

/**
 * JSON 이미지 문자열 파싱 헬퍼 함수
 * @author Antigravity
 */
const parseImages = (imageUrl?: string): string[] => {
  if (!imageUrl) return [];
  try {
    const parsed = JSON.parse(imageUrl);
    return Array.isArray(parsed) ? parsed : [imageUrl];
  } catch {
    return [imageUrl];
  }
};

/**
 * 커뮤니티 게시글 상세 및 댓글 조회/등록 화면 컴포넌트
 * @author Antigravity
 */
export const PostDetailScreen = () => {
  const router = useRouter();
  const { colors } = useTheme();
  const { t } = useTranslation();
  const { postId } = useLocalSearchParams<{ postId: string }>();
  const boardId = parseInt(postId ?? '', 10);

  const userProfile = useAtomValue(userProfileAtom);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLikedLocal, setIsLikedLocal] = useState(false);

  // Queries & Mutations
  const isRealBoard = !isNaN(boardId);
  const { data: post, isLoading: isPostLoading } = useBoardDetailQuery(boardId);
  const { data: likeCountData } = useLikeCountQuery(boardId);
  const { data: commentsData } = useBoardCommentsQuery(boardId, 0, 50);

  useEffect(() => {
    if (post && post.isLiked !== undefined) {
      setIsLikedLocal(post.isLiked);
    }
  }, [post]);

  const { mutate: deleteBoard } = useDeleteBoardMutation();
  const { mutate: toggleLike } = useToggleLikeMutation();
  const { mutate: addComment } = useAddCommentMutation(boardId);
  const { mutate: updateComment } = useUpdateCommentMutation(boardId);
  const { mutate: deleteComment } = useDeleteCommentMutation(boardId);

  // Fallback to mock post if not a real board ID
  const mockPost = !isRealBoard ? (MOCK_POSTS.find((p) => p.id === postId) || MOCK_POSTS[0]) : null;
  const activePost = post || (mockPost ? {
    boardId: 9999,
    title: 'Mock Post',
    content: mockPost.content,
    imageUrl: JSON.stringify(mockPost.images),
    authorId: 9999,
    authorNickname: mockPost.author.name,
    createdAt: mockPost.createdAt,
    updatedAt: mockPost.createdAt,
    category: mockPost.category as TBoardCategory,
    linkedRecipe: mockPost.linkedRecipe,
  } : null);

  const isAuthor = !!userProfile && !!activePost && activePost.authorId === Number(userProfile.id);

  const handleEdit = () => {
    if (!activePost) return;
    router.push({
      pathname: '/community/write',
      params: {
        postId: String(activePost.boardId),
        mode: 'edit',
        initCategory: activePost.category || 'review',
        initContent: activePost.content,
        initTitle: activePost.title,
        initLinkedRecipeNameKo: activePost.linkedRecipe?.nameKo ?? '',
        initLinkedRecipeEmoji: activePost.linkedRecipe?.emoji ?? '',
        initImages: JSON.stringify(parseImages(activePost.imageUrl)),
      },
    });
  };

  const handleDelete = () => {
    if (isRealBoard) {
      deleteBoard(boardId, { onSuccess: () => router.back() });
    } else {
      router.back();
    }
  };

  const handleUpdateComment = (commentId: string, content: string) => {
    if (isRealBoard) {
      updateComment({ commentId: parseInt(commentId, 10), content });
    }
  };

  const handleDeleteComment = (commentId: string) => {
    if (isRealBoard) {
      deleteComment(parseInt(commentId, 10));
    }
  };

  const handleAddComment = (text: string) => {
    if (isRealBoard) {
      addComment({ content: text, authorName: userProfile?.name });
    }
  };

  const handleLike = () => {
    if (isRealBoard) {
      const currentLiked = isLikedLocal;
      setIsLikedLocal(!currentLiked);

      toggleLike(
        { boardId, currentLiked },
        {
          onSuccess: (data) => {
            setIsLikedLocal(data.liked);
          },
          onError: () => {
            setIsLikedLocal(currentLiked);
          },
        }
      );
    } else {
      setIsLikedLocal((prev) => !prev);
    }
  };

  // Map backend comments (or mock comments) to UI structure
  const rawComments = isRealBoard ? (commentsData?.content || []) : MOCK_COMMENTS.map((c) => ({
    commentId: 9999,
    boardId: 9999,
    authorId: 9999,
    authorName: c.author.name,
    commentContent: c.content,
    createdAt: c.createdAt,
    updatedAt: c.createdAt,
  }));

  const comments = rawComments.map((c) => ({
    id: String(c.commentId),
    author: { id: String(c.authorId), name: c.authorName || '익명', avatarUrl: undefined },
    createdAt: c.createdAt,
    content: c.commentContent,
  }));

  if (isRealBoard && (isPostLoading || !post)) {
    return (
      <ScreenLayout>
        <Header title={t('community.postDetail')} onBack={() => router.back()} />
        <View style={styles.loadingContainer}>
          <Text variant="bodySecondary">{t('common.loading')}</Text>
        </View>
      </ScreenLayout>
    );
  }

  if (!activePost) {
    return (
      <ScreenLayout>
        <Header title={t('community.postDetail')} onBack={() => router.back()} />
        <View style={styles.loadingContainer}>
          <Text variant="bodySecondary">{t('community.postNotFound')}</Text>
        </View>
      </ScreenLayout>
    );
  }

  return (
    <ScreenLayout>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.keyboardAvoiding}
      >
        <Header
          title={t('community.postDetail')}
          onBack={() => router.back()}
          rightAction={
            isAuthor ? (
              <Pressable onPress={() => setIsMenuOpen(true)} hitSlop={8}>
                <Text variant="label" style={{ fontSize: 20, color: colors.text }}>⋯</Text>
              </Pressable>
            ) : undefined
          }
        />

        <FlatList
          data={comments}
          keyExtractor={(item) => item.id}
          ListHeaderComponent={
            <View style={{ marginBottom: 16 }}>
              <PostDetail
                author={{ name: activePost.authorNickname || '익명' }}
                createdAt={activePost.createdAt}
                category={activePost.category || 'review'}
                images={parseImages(activePost.imageUrl)}
                content={activePost.content}
                title={activePost.title}
                likeCount={likeCountData ?? 0}
                commentCount={commentsData?.totalElements ?? 0}
                isLiked={isLikedLocal}
                linkedRecipe={activePost.linkedRecipe}
                onLike={handleLike}
                onRecipePress={() => {
                  if (activePost.linkedRecipe?.id) {
                    router.push(`/food/${activePost.linkedRecipe.id}` as Href);
                  }
                }}
              />
              <Text variant="h3" bold style={styles.commentHeader}>
                {t('community.commentsCount', { count: commentsData?.totalElements ?? 0 })}
              </Text>
            </View>
          }
          renderItem={({ item }) => (
            <CommentItem
              comment={item}
              isAuthor={!!userProfile && item.author.id === String(userProfile.id)}
              onUpdate={handleUpdateComment}
              onDelete={handleDeleteComment}
            />
          )}
          contentContainerStyle={styles.listContent}
        />

        <CommentInput
          onSubmit={handleAddComment}
          placeholder={t('comment.placeholder')}
        />
      </KeyboardAvoidingView>

      <PostMoreMenu
        visible={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </ScreenLayout>
  );
};

const styles = StyleSheet.create({
  keyboardAvoiding: {
    flex: 1,
  },
  commentHeader: {
    fontSize: 15,
    marginTop: 16,
    marginBottom: 8,
  },
  listContent: {
    paddingBottom: 24,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export { PostDetailScreen as default };
