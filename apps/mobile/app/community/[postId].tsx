import React, { useState, useEffect } from 'react';
import { View, StyleSheet, FlatList, KeyboardAvoidingView, Platform, Pressable } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useAtomValue } from 'jotai';

import { useTranslation } from '@ongo/i18n';
import {
  ScreenLayout,
  Header,
  PostDetail,
  CommentInput,
  Text,
  Icon,
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
 * 커뮤니티 게시글 상세 및 댓글 조회/등록 화면 컴포넌트
 * @author Antigravity
 */
export const PostDetailScreen = () => {
  const router = useRouter();
  const { colors } = useTheme();
  const { t } = useTranslation();
  const { postId } = useLocalSearchParams<{ postId: string }>();
  const boardId = parseInt(postId ?? '', 10);

  const getCategoryLabel = (category?: any) => {
    if (!category) return '';
    const categoryStr = typeof category === 'string' ? category : (category.id || category.code || category.name || String(category));
    if (!categoryStr || typeof categoryStr !== 'string') return '';
    switch (categoryStr.trim().toUpperCase()) {
      case 'REVIEW':
        return t('community.cookingReview');
      case 'RECIPE':
        return t('community.myRecipe');
      case 'QNA':
        return t('community.qna');
      default:
        return categoryStr;
    }
  };

  const userProfile = useAtomValue(userProfileAtom);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLikedLocal, setIsLikedLocal] = useState(false);
  const [isEditingComment, setIsEditingComment] = useState(false);

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
    title: mockPost.title ?? 'Mock Post',
    content: mockPost.content,
    imageUrls: mockPost.images ?? [],
    authorId: 9999,
    authorNickname: mockPost.author.name,
    createdAt: mockPost.createdAt,
    updatedAt: mockPost.createdAt,
    category: mockPost.category as TBoardCategory,
    likeCount: 0,
    commentCount: 0,
    isLiked: false,
  } : null);

  const isAuthor = !!userProfile && !!activePost && activePost.authorId === Number(userProfile.id);

  const handleEdit = () => {
    if (!activePost) return;
    router.push({
      pathname: '/community/write',
      params: {
        postId: String(activePost.boardId),
        mode: 'edit',
        initCategory: activePost.category ?? 'REVIEW',
        initContent: activePost.content,
        initTitle: activePost.title,
        initImages: JSON.stringify(activePost.imageUrls),
        ...(activePost.recipeId ? { initLinkedRecipeId: activePost.recipeId } : {}),
      },
    });
  };

  const handleRecipePress = () => {
    if (activePost?.recipeId) {
      router.push(`/food/${activePost.recipeId}`);
    }
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
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="none"
          removeClippedSubviews={false}
          ListHeaderComponent={
            <View style={{ marginBottom: 16 }}>
              {/* 연결 레시피 칩 — recipeId가 있을 때만 표시 */}
              {activePost.recipeId && (
                <Pressable
                  style={[styles.recipeChip, { backgroundColor: colors.primaryLight, borderColor: colors.border }]}
                  onPress={handleRecipePress}
                >
                  <Text style={{ fontSize: 14, marginRight: 4 }}>🍲</Text>
                  <Text variant="caption" bold style={{ color: colors.primary }}>
                    {t('community.linkedRecipe')}
                  </Text>
                  <Icon name="back" size={12} color={colors.primary} style={{ transform: [{ rotate: '180deg' }], marginLeft: 4 }} />
                </Pressable>
              )}
              <PostDetail
                author={{ name: activePost.authorNickname || '익명' }}
                createdAt={activePost.createdAt}
                category={getCategoryLabel(activePost.category)}
                images={activePost.imageUrls}
                content={activePost.content}
                title={activePost.title}
                likeCount={likeCountData ?? 0}
                commentCount={commentsData?.totalElements ?? 0}
                isLiked={isLikedLocal}
                onLike={handleLike}
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
              onEditingChange={setIsEditingComment}
            />
          )}
          contentContainerStyle={styles.listContent}
        />

        {!isEditingComment && (
          <CommentInput
            onSubmit={handleAddComment}
            placeholder={t('comment.placeholder')}
          />
        )}
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
  recipeChip: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    marginTop: 8,
    marginBottom: 4,
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
