import React, { useState } from 'react';
import { View, StyleSheet, FlatList, KeyboardAvoidingView, Platform } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';

import { useTranslation } from '@ongo/i18n';
import {
  ScreenLayout,
  Header,
  PostDetail,
  CommentInput,
  Text,
  Avatar,
  useTheme,
} from '@ongo/ui';
import { formatDate } from '@ongo/utils';

import { MOCK_POSTS, MOCK_COMMENTS } from '../../mocks';

/**
 * 커뮤니티 게시글 상세 및 댓글 조회/등록 화면 컴포넌트
 * @author Antigravity
 */
export const PostDetailScreen = () => {
  const router = useRouter();
  const { colors } = useTheme();
  const { t } = useTranslation();
  const { postId } = useLocalSearchParams<{ postId: string }>();
  const [comments, setComments] = useState(MOCK_COMMENTS);
  
  // Find the post from shared mock posts or fall back to the first one
  const initialPost = MOCK_POSTS.find((p) => p.id === postId) || MOCK_POSTS[0];
  const [post, setPost] = useState(initialPost);

  const handleAddComment = (text: string) => {
    const newComment = {
      id: `c${Date.now()}`,
      author: { name: '나의계정', avatarUrl: undefined },
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
        <Header title={t('community.postDetail')} onBack={() => router.back()} />

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
            <View style={styles.commentRow}>
              <Avatar name={item.author.name} size={30} />
              <View style={styles.commentMeta}>
                <View style={styles.commentHeaderRow}>
                  <Text variant="label" bold style={{ fontSize: 13 }}>
                    {item.author.name}
                  </Text>
                  <Text variant="caption" style={styles.commentTime}>
                    {formatDate(item.createdAt)}
                  </Text>
                </View>
                <Text variant="body" style={styles.commentContent}>
                  {item.content}
                </Text>
              </View>
            </View>
          )}
          contentContainerStyle={styles.listContent}
        />

        <CommentInput
          onSubmit={handleAddComment}
          placeholder={t('comment.placeholder')}
        />
      </ScreenLayout>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  commentHeader: {
    fontSize: 15,
    marginTop: 16,
    marginBottom: 8,
  },
  commentRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
    paddingHorizontal: 4,
  },
  commentMeta: {
    flex: 1,
    marginLeft: 12,
  },
  commentHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  commentTime: {
    fontSize: 10,
  },
  commentContent: {
    fontSize: 13,
    lineHeight: 18,
    marginTop: 4,
  },
  listContent: {
    paddingBottom: 24,
  },
});

export { PostDetailScreen as default };
