import React, { useState, useCallback } from 'react';
import { View, StyleSheet, FlatList, Pressable } from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import { useQueryClient } from '@tanstack/react-query';
import type { InfiniteData } from '@tanstack/react-query';

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
import {
  useBoardsInfiniteQuery,
  useToggleLikeMutation,
  communityKeys,
} from '@ongo/api-client';
import type { TBoardCategory, TBoardSummary, TPage } from '@ongo/api-client';

const FILTER_CATEGORIES: { id: 'all' | TBoardCategory; labelKey: string }[] = [
  { id: 'all', labelKey: 'community.all' },
  { id: 'REVIEW', labelKey: 'community.cookingReview' },
  { id: 'RECIPE', labelKey: 'community.myRecipe' },
  { id: 'QNA', labelKey: 'community.qna' },
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
  const queryClient = useQueryClient();
  const [selectedFilter, setSelectedFilter] = useState<'all' | TBoardCategory>('all');

  const category = selectedFilter === 'all' ? undefined : selectedFilter;

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    refetch,
  } = useBoardsInfiniteQuery(10, category);

  const { mutate: toggleLike } = useToggleLikeMutation();

  /**
   * 탭 포커스 시 자동 데이터 갱신
   * 게시글 작성/수정 후 돌아올 때 최신 목록 반영
   */
  useFocusEffect(
    useCallback(() => {
      refetch();
    }, [refetch])
  );

  const allBoards = data?.pages.flatMap((page) => page.content) || [];

  const handlePostPress = (boardId: number) => {
    router.push(`/community/${boardId}`);
  };

  /**
   * 게시글 좋아요 낙관적 업데이트 핸들러
   * 즉시 UI를 반영하고 서버 응답 실패 시 롤백합니다.
   * @author Antigravity
   */
  const handleLike = (boardId: number, currentIsLiked: boolean, currentLikeCount: number) => {
    // 1. 낙관적 업데이트: 캐시의 board list 데이터를 즉시 변경
    queryClient.setQueriesData<InfiniteData<TPage<TBoardSummary>>>(
      { queryKey: communityKeys.boardLists() },
      (old) => {
        if (!old || !old.pages) return old;
        return {
          ...old,
          pages: old.pages.map((page) => ({
            ...page,
            content: page.content.map((board) =>
              board.boardId === boardId
                ? {
                    ...board,
                    isLiked: !currentIsLiked,
                    likeCount: currentIsLiked
                      ? Math.max(0, board.likeCount - 1)
                      : board.likeCount + 1,
                  }
                : board
            ),
          })),
        };
      }
    );

    // 2. 서버 요청
    toggleLike(
      { boardId, currentLiked: currentIsLiked },
      {
        onError: () => {
          // 3. 실패 시 원래 값으로 롤백
          queryClient.setQueriesData<InfiniteData<TPage<TBoardSummary>>>(
            { queryKey: communityKeys.boardLists() },
            (old) => {
              if (!old || !old.pages) return old;
              return {
                ...old,
                pages: old.pages.map((page) => ({
                  ...page,
                  content: page.content.map((board) =>
                    board.boardId === boardId
                      ? {
                          ...board,
                          isLiked: currentIsLiked,
                          likeCount: currentLikeCount,
                        }
                      : board
                  ),
                })),
              };
            }
          );
        },
        onSettled: () => {
          // 4. 성공/실패 무관하게 서버 데이터로 최종 동기화
          queryClient.invalidateQueries({ queryKey: communityKeys.boards() });
        },
      }
    );
  };

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
        data={allBoards}
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
            category={item.category}
            images={item.imageUrls}
            content=""
            title={item.title}
            likeCount={item.likeCount}
            commentCount={item.commentCount}
            isLiked={item.isLiked}
            onPress={() => handlePostPress(item.boardId)}
            onLike={() => handleLike(item.boardId, item.isLiked, item.likeCount)}
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
