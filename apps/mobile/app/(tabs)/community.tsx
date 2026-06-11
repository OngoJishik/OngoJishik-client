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
import { useBoardsInfiniteQuery, useToggleLikeMutation } from '@ongo/api-client';

const FILTER_CATEGORIES = [
  { id: 'all', labelKey: 'community.all' },
  { id: 'review', labelKey: 'community.cookingReview' },
  { id: 'recipe', labelKey: 'community.myRecipe' },
  { id: 'qna', labelKey: 'community.qna' },
];

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
 * 커뮤니티 피드 화면 컴포넌트
 * 전통 음식 조리 후기, 나만의 레시피, 질문/답변 카테고리별 글을 확인하고 작성할 수 있습니다.
 * @author Antigravity
 */
export const CommunityScreen = () => {
  const router = useRouter();
  const { colors } = useTheme();
  const { t } = useTranslation();
  const [selectedFilter, setSelectedFilter] = useState('all');

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    refetch,
  } = useBoardsInfiniteQuery(10);

  const { mutate: toggleLike } = useToggleLikeMutation();

  const handlePostPress = (boardId: number) => {
    router.push(`/community/${boardId}`);
  };

  const handleLike = (boardId: number) => {
    toggleLike({ boardId });
  };

  const allBoards = data?.pages.flatMap((page) => page.content) || [];

  const filteredPosts = allBoards.filter((board) => {
    const category = board.category || 'review';
    return selectedFilter === 'all' || category === selectedFilter;
  });

  const handleLoadMore = () => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  };

  return (
    <ScreenLayout>
      <Header
        title={t('community.title')}
        titleIcon="community"
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
              selectedFilter === filter.id && { backgroundColor: designColors.primary.DEFAULT },
            ]}
            onPress={() => setSelectedFilter(filter.id)}
          >
            <Text
              variant="caption"
              bold={selectedFilter === filter.id}
              style={[
                { color: colors.textSecondary },
                selectedFilter === filter.id && { color: designColors.white },
              ]}
            >
              {t(filter.labelKey)}
            </Text>
          </Pressable>
        ))}
      </View>

      <FlatList
        data={filteredPosts}
        keyExtractor={(item) => String(item.boardId)}
        showsVerticalScrollIndicator={false}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
        refreshing={isFetchingNextPage}
        onRefresh={refetch}
        renderItem={({ item }) => (
          <PostCard
            author={{ name: item.authorNickname || '익명' }}
            createdAt={item.createdAt}
            category={item.category || 'review'}
            images={parseImages(item.imageUrl)}
            content="" // Feed list does not return full content; title is displayed
            title={item.title}
            likeCount={0} // Default since not in Summary response yet
            commentCount={0} // Default since not in Summary response yet
            isLiked={false}
            onPress={() => handlePostPress(item.boardId)}
            onLike={() => handleLike(item.boardId)}
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

