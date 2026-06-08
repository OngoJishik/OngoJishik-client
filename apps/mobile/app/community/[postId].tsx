import React, { useState } from 'react';
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
  useTheme,
} from '@ongo/ui';
import { userProfileAtom } from '@ongo/store';
import { useDeletePostMutation } from '@ongo/api-client';

import { MOCK_POSTS, MOCK_COMMENTS } from '../../mocks';
import { CommentItem } from './components/CommentItem';
import { PostMoreMenu } from './components/PostMoreMenu';
import type { TCommentData } from './components/CommentItem';

/**
 * 커뮤니티 게시글 상세 및 댓글 조회/등록 화면 컴포넌트
 * @author Antigravity
 */
export const PostDetailScreen = () => {
  const router = useRouter();
  const { colors } = useTheme();
  const { t } = useTranslation();
  const { postId } = useLocalSearchParams<{ postId: string }>();
  const userProfile = useAtomValue(userProfileAtom);
  const { mutate: deletePost } = useDeletePostMutation();
  const [comments, setComments] = useState<TCommentData[]>(MOCK_COMMENTS);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Find the post from shared mock posts or fall back to the first one
  const initialPost = MOCK_POSTS.find((p) => p.id === postId) || MOCK_POSTS[0];
  const [post, setPost] = useState(initialPost);

  const isAuthor = !!userProfile && post.author.id === userProfile.id;

  const handleEdit = () => {
    router.push({
      pathname: '/community/write',
      params: {
        postId: post.id,
        mode: 'edit',
        initCategory: post.category,
        initContent: post.content,
        initLinkedRecipeNameKo: post.linkedRecipe?.nameKo ?? '',
        initLinkedRecipeEmoji: post.linkedRecipe?.emoji ?? '',
        initImages: JSON.stringify(post.images),
      },
    });
  };

  const handleDelete = () => {
    deletePost(post.id, { onSuccess: () => router.back() });
  };

  const handleUpdateComment = (commentId: string, content: string) => {
    setComments((prev) =>
      prev.map((c) => (c.id === commentId ? { ...c, content } : c)),
    );
  };

  const handleDeleteComment = (commentId: string) => {
    setComments((prev) => prev.filter((c) => c.id !== commentId));
    setPost((prev) => ({ ...prev, commentCount: Math.max(0, prev.commentCount - 1) }));
  };

  const handleAddComment = (text: string) => {
    const newComment: TCommentData = {
      id: `c${Date.now()}`,
      author: { id: userProfile?.id ?? 'me', name: userProfile?.name ?? '나의계정', avatarUrl: undefined },
      createdAt: new Date().toISOString(),
      content: text,
    };

    setComments((prev) => [...prev, newComment]);
    setPost((prev) => ({
      ...prev,
      commentCount: prev.commentCount + 1,
    }));
  };

  const handleLike = () => {
    setPost((prev) => ({
      ...prev,
      isLiked: !prev.isLiked,
      likeCount: prev.isLiked ? prev.likeCount - 1 : prev.likeCount + 1,
    }));
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1 }}
    >
      <ScreenLayout>
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
                author={post.author}
                createdAt={post.createdAt}
                category={post.category}
                images={post.images}
                content={post.content}
                likeCount={post.likeCount}
                commentCount={post.commentCount}
                isLiked={post.isLiked}
                linkedRecipe={post.linkedRecipe}
                onLike={handleLike}
                onRecipePress={() => {
                  if (post.linkedRecipe?.id) {
                    router.push(`/food/${post.linkedRecipe.id}`);
                  }
                }}
              />
              <Text variant="h3" bold style={styles.commentHeader}>
                {t('community.commentsCount', { count: post.commentCount })}
              </Text>
            </View>
          }
          renderItem={({ item }) => (
            <CommentItem
              comment={item}
              isAuthor={!!userProfile && item.author.id === userProfile.id}
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
      </ScreenLayout>

      <PostMoreMenu
        visible={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  commentHeader: {
    fontSize: 15,
    marginTop: 16,
    marginBottom: 8,
  },
  listContent: {
    paddingBottom: 24,
  },
});

export { PostDetailScreen as default };
