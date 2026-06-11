import React from 'react';
import { View, StyleSheet, FlatList, Pressable } from 'react-native';
import { useRouter, Href } from 'expo-router';

import { useTranslation } from '@ongo/i18n';
import { ScreenLayout, Header, Text, useTheme, Card } from '@ongo/ui';
import { formatDate } from '@ongo/utils';
import { useMyCommentsQuery } from '@ongo/api-client';

/**
 * 내가 작성한 댓글 목록 화면 컴포넌트
 * @author Antigravity
 */
export const MyCommentsScreen = () => {
  const router = useRouter();
  const { colors } = useTheme();
  const { t } = useTranslation();

  const { data: myCommentsData, isLoading, refetch } = useMyCommentsQuery(0, 50);

  const comments = myCommentsData?.content || [];

  const handleCommentPress = (boardId: number) => {
    router.push(`/community/${boardId}` as Href);
  };

  if (isLoading) {
    return (
      <ScreenLayout>
        <Header title={t('mypage.myComments', '내가 작성한 댓글')} onBack={() => router.back()} />
        <View style={styles.centerContainer}>
          <Text variant="bodySecondary">{t('common.loading')}</Text>
        </View>
      </ScreenLayout>
    );
  }

  return (
    <ScreenLayout>
      <Header title={t('mypage.myComments', '내가 작성한 댓글')} onBack={() => router.back()} />

      {comments.length === 0 ? (
        <View style={styles.centerContainer}>
          <Text variant="bodySecondary">{t('myComments.empty', '작성한 댓글이 없습니다.')}</Text>
        </View>
      ) : (
        <FlatList
          data={comments}
          keyExtractor={(item) => String(item.commentId)}
          showsVerticalScrollIndicator={false}
          onRefresh={refetch}
          refreshing={isLoading}
          renderItem={({ item }) => (
            <Card style={styles.card} bordered>
              <Pressable onPress={() => handleCommentPress(item.boardId)}>
                <View style={styles.cardHeader}>
                  <Text variant="caption" bold style={{ color: colors.primary }}>
                    {t('myComments.originalPost', '원문 게시글')}
                  </Text>
                  <Text variant="caption" style={{ color: colors.textTertiary }}>
                    {formatDate(item.createdAt)}
                  </Text>
                </View>
                
                <Text variant="body" bold style={[styles.boardTitle, { color: colors.text }]} numberOfLines={1}>
                  {item.boardTitle || t('myComments.noTitle', '제목 없음')}
                </Text>
                
                <View style={[styles.commentBody, { backgroundColor: colors.primaryLight, borderColor: colors.border }]}>
                  <Text variant="body" style={{ color: colors.textSecondary }}>
                    {item.commentContent}
                  </Text>
                </View>
              </Pressable>
            </Card>
          )}
          contentContainerStyle={styles.listContent}
        />
      )}
    </ScreenLayout>
  );
};

const styles = StyleSheet.create({
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContent: {
    paddingVertical: 16,
    paddingHorizontal: 4,
  },
  card: {
    marginBottom: 12,
    padding: 14,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  boardTitle: {
    fontSize: 15,
    marginBottom: 8,
  },
  commentBody: {
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
  },
});

export { MyCommentsScreen as default };
