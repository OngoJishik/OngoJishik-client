import React, { useState } from 'react';
import { View, StyleSheet, FlatList, Pressable } from 'react-native';
import { useRouter } from 'expo-router';

import { useTranslation } from '@ongo/i18n';
import {
  ScreenLayout,
  Header,
  PostCard,
  Text,
  Icon,
  useTheme,
} from '@ongo/ui';
import { colors as designColors } from '@ongo/ui';

import { MOCK_POSTS } from '../../mocks';

const FILTER_CATEGORIES = [
  { id: 'all', labelKey: 'community.all', value: '전체' },
  { id: 'cookingReview', labelKey: 'community.cookingReview', value: '조리 후기' },
  { id: 'myRecipe', labelKey: 'community.myRecipe', value: '나만의 레시피' },
  { id: 'qna', labelKey: 'community.qna', value: '질문/답변' },
];

/**
 * 커뮤니티 피드 화면 컴포넌트
 * 전통 음식 조리 후기, 나만의 레시피, 질문/답변 카테고리별 글을 확인하고 작성할 수 있습니다.
 * @author Antigravity
 */
export const CommunityScreen = () => {
  const router = useRouter();
  const { colors } = useTheme();
  const { t } = useTranslation();
  const [selectedFilter, setSelectedFilter] = useState('전체');
  const [posts, setPosts] = useState(MOCK_POSTS);

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

  const filteredPosts = selectedFilter === '전체' 
    ? posts 
    : posts.filter((post) => post.category === selectedFilter);

  return (
    <ScreenLayout>
      <Header
        title={`💬 ${t('community.title')}`}
        rightAction={
          <Pressable onPress={() => router.push('/community/write')}>
            <Icon name="write" size={22} color={colors.text} />
          </Pressable>
        }
      />

      <View style={[styles.filterBar, { borderBottomColor: colors.border }]}>
        {FILTER_CATEGORIES.map((filter) => (
          <Pressable
            key={filter.id}
            style={[
              styles.filterTab,
              { backgroundColor: colors.primaryLight },
              selectedFilter === filter.value && { backgroundColor: designColors.primary.DEFAULT },
            ]}
            onPress={() => setSelectedFilter(filter.value)}
          >
            <Text
              variant="caption"
              bold={selectedFilter === filter.value}
              style={[
                { color: colors.textSecondary },
                selectedFilter === filter.value && { color: designColors.white },
              ]}
            >
              {t(filter.labelKey)}
            </Text>
          </Pressable>
        ))}
      </View>

      <FlatList
        data={filteredPosts}
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
          />
        )}
        contentContainerStyle={styles.listContent}
      />
    </ScreenLayout>
  );
};

export { CommunityScreen as default };

const styles = StyleSheet.create({
  filterBar: {
    flexDirection: 'row',
    paddingVertical: 12,
    borderBottomWidth: 1,
    marginBottom: 8,
  },
  filterTab: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
  },
  listContent: {
    paddingBottom: 48,
  },
});
