import React, { useState } from 'react';
import { FlatList, View, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';

import { useTranslation } from '@ongo/i18n';
import {
  ScreenLayout,
  Header,
  PostCard,
  Text,
  useTheme,
} from '@ongo/ui';

import { MOCK_MY_POSTS } from '../mocks';

/**
 * 내 게시글 목록 화면 컴포넌트
 * 마이페이지 등에서 이동할 수 있으며, 사용자가 직접 작성한 커뮤니티 게시글 목록을 확인합니다.
 * @author Antigravity
 */
export const MyPostsScreen = () => {
  const router = useRouter();
  const { colors } = useTheme();
  const { t } = useTranslation();
  const [posts, setPosts] = useState(MOCK_MY_POSTS);

  const handlePostPress = (postId: string) => {
    router.push(`/community/${postId}`);
  };

  const handleLike = (postId: string) => {
    setPosts((prev) =>
      prev.map((post) =>
        post.id === postId
          ? {
              ...post,
              isLiked: !post.isLiked,
              likeCount: post.isLiked ? post.likeCount - 1 : post.likeCount + 1,
            }
          : post
      )
    );
  };

  return (
    <ScreenLayout>
      <Header title={`📝 ${t('myPosts.title')}`} onBack={() => router.back()} />

      {posts.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text variant="bodySecondary">{t('myPosts.empty')}</Text>
        </View>
      ) : (
        <FlatList
          data={posts}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <PostCard
              author={item.author}
              createdAt={item.createdAt}
              category={item.category}
              images={item.images}
              linkedRecipe={item.linkedRecipe}
              content={item.content}
              likeCount={item.likeCount}
              commentCount={item.commentCount}
              isLiked={item.isLiked}
              onPress={() => handlePostPress(item.id)}
              onLike={() => handleLike(item.id)}
              onShare={() => {
                if (__DEV__) {
                  console.log('Share post', item.id);
                }
              }}
            />
          )}
          contentContainerStyle={styles.listContent}
        />
      )}
    </ScreenLayout>
  );
};

export default MyPostsScreen;

const styles = StyleSheet.create({
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContent: {
    paddingVertical: 16,
  },
});
