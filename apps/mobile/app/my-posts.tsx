import React from 'react';
import { FlatList, View, StyleSheet, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';

import { useTranslation } from '@ongo/i18n';
import {
  ScreenLayout,
  Header,
  PostCard,
  Text,
  useTheme,
} from '@ongo/ui';
import { useMyBoardsInfiniteQuery, useToggleLikeMutation } from '@ongo/api-client';

/**
 * 내 게시글 목록 화면 컴포넌트
 * 마이페이지 등에서 이동할 수 있으며, 사용자가 직접 작성한 커뮤니티 게시글 목록을 확인합니다.
 * @author Antigravity
 */
export const MyPostsScreen = () => {
  const router = useRouter();
  const { colors } = useTheme();
  const { t } = useTranslation();

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    refetch,
  } = useMyBoardsInfiniteQuery(10);

  const { mutate: toggleLike } = useToggleLikeMutation();

  const allPosts = data?.pages.flatMap((page) => page.content) ?? [];

  const handlePostPress = (boardId: number) => {
    router.push(`/community/${boardId}`);
  };

  const handleLike = (boardId: number) => {
    toggleLike({ boardId });
  };

  const handleLoadMore = () => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  };

  if (isLoading) {
    return (
      <ScreenLayout>
        <Header title={t('myPosts.title')} titleIcon="write" onBack={() => router.back()} />
        <View style={styles.emptyContainer}>
          <ActivityIndicator color={colors.primary} />
        </View>
      </ScreenLayout>
    );
  }

  return (
    <ScreenLayout>
      <Header title={t('myPosts.title')} titleIcon="write" onBack={() => router.back()} />

      {allPosts.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text variant="bodySecondary">{t('myPosts.empty')}</Text>
        </View>
      ) : (
        <FlatList
          data={allPosts}
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
              onLike={() => handleLike(item.boardId)}
            />
          )}
          ListFooterComponent={
            isFetchingNextPage ? (
              <View style={styles.footerLoader}>
                <ActivityIndicator color={colors.primary} />
              </View>
            ) : null
          }
          contentContainerStyle={styles.listContent}
        />
      )}
    </ScreenLayout>
  );
};

export { MyPostsScreen as default };

const styles = StyleSheet.create({
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContent: {
    paddingVertical: 16,
  },
  footerLoader: {
    paddingVertical: 16,
    alignItems: 'center',
  },
});
