import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, FlatList, KeyboardAvoidingView, Platform } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import {
  ScreenLayout,
  Header,
  PostCard,
  CommentInput,
  Text,
  Avatar,
} from '@ongo/ui';
import { formatDate } from '@ongo/utils';

const MOCK_POST = {
  id: 'post1',
  author: { name: '전통요리사_하나', avatarUrl: undefined },
  createdAt: '2026-05-27T08:00:00Z',
  language: 'Korean',
  images: [],
  linkedRecipe: { id: 'yukgaejang', nameKo: '육개장', emoji: '🍲' },
  content: '대구식 정통 육개장 끓여봤어요! 할머니 대부터 전해 내려온 비법은 다름 아닌 잘 볶은 고추기름과 듬뿍 넣은 대파입니다. 푹 끓여내니 국물이 시원하고 정말 보신이 되네요. 다들 이번 주말 점심으로 얼큰한 육개장 어떠세요?',
  likeCount: 128,
  commentCount: 2,
  isLiked: true,
};

const MOCK_COMMENTS = [
  {
    id: 'c1',
    author: { name: 'KimCook', avatarUrl: undefined },
    createdAt: '2026-05-27T08:15:00Z',
    content: '우와, 정말 칼칼하고 시원해보여요! 고춧기름 내는 비결이 궁금하네요.',
  },
  {
    id: 'c2',
    author: { name: '전통매니아', avatarUrl: undefined },
    createdAt: '2026-05-27T09:00:00Z',
    content: '대파를 푹 끓이면 은은한 단맛도 돌아서 국물 맛이 일품이죠. 멋진 레시피 후기 감사드립니다!',
  },
];

export default function PostDetailScreen() {
  const router = useRouter();
  const { postId } = useLocalSearchParams();
  const [commentVal, setCommentVal] = useState('');
  const [comments, setComments] = useState(MOCK_COMMENTS);
  const [post, setPost] = useState(MOCK_POST);

  const handleAddComment = () => {
    if (!commentVal.trim()) return;

    const newComment = {
      id: `c${Date.now()}`,
      author: { name: '나의계정', avatarUrl: undefined },
      createdAt: new Date().toISOString(),
      content: commentVal,
    };

    setComments((prev) => [...prev, newComment]);
    setPost((prev) => ({
      ...prev,
      commentCount: prev.commentCount + 1,
    }));
    setCommentVal('');
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
        <Header title="게시글 상세" onBack={() => router.back()} />

        <FlatList
          data={comments}
          keyExtractor={(item) => item.id}
          ListHeaderComponent={
            <View style={{ marginBottom: 16 }}>
              <PostCard
                author={post.author}
                createdAt={post.createdAt}
                language={post.language}
                images={post.images}
                linkedRecipe={post.linkedRecipe}
                content={post.content}
                likeCount={post.likeCount}
                commentCount={post.commentCount}
                isLiked={post.isLiked}
                onPress={() => {}}
                onLike={handleLike}
                onShare={() => console.log('Share')}
              />
              <Text variant="h3" bold style={styles.commentHeader}>
                댓글 {post.commentCount}개
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
          value={commentVal}
          onChangeText={setCommentVal}
          onSubmit={handleAddComment}
        />
      </ScreenLayout>
    </KeyboardAvoidingView>
  );
}

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
