import React from 'react';
import { View, StyleSheet, FlatList, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { useSetAtom } from 'jotai';

import { useTranslation } from '@ongo/i18n';
import {
  ScreenLayout,
  Header,
  Text,
  Icon,
  useTheme,
} from '@ongo/ui';
import { recentSearchAtom } from '@ongo/store';
import {
  useSearchHistoryQuery,
  useDeleteAllSearchHistoryMutation,
  useDeleteSearchHistoryMutation,
} from '@ongo/api-client';

/**
 * 최근 검색 기록 조회 및 삭제 기능을 제공하는 전용 화면 컴포넌트
 * @author Antigravity
 */
export const SearchHistoryScreen = () => {
  const router = useRouter();
  const { colors } = useTheme();
  const { t } = useTranslation();
  const addRecentSearch = useSetAtom(recentSearchAtom);

  const { data: historyData, isLoading, refetch } = useSearchHistoryQuery();
  const { mutate: deleteAll } = useDeleteAllSearchHistoryMutation();
  const { mutate: deleteOne } = useDeleteSearchHistoryMutation();

  const recentSearches = historyData?.searches ?? [];

  const handleSearch = (query: string) => {
    const trimmed = query.trim();
    if (trimmed) {
      addRecentSearch(trimmed);
      router.push(`/search/results?q=${encodeURIComponent(trimmed)}`);
    }
  };

  const clearAllRecent = () => {
    deleteAll();
  };

  const removeRecentSearch = (searchId: number) => {
    deleteOne(searchId);
  };

  if (isLoading) {
    return (
      <ScreenLayout>
        <Header
          title={t('mypage.searchHistory', '검색 기록')}
          onBack={() => router.back()}
        />
        <View style={styles.centerContainer}>
          <Text variant="bodySecondary">{t('common.loading', '로딩 중...')}</Text>
        </View>
      </ScreenLayout>
    );
  }

  return (
    <ScreenLayout>
      <Header
        title={t('mypage.searchHistory', '검색 기록')}
        onBack={() => router.back()}
        rightAction={
          recentSearches.length > 0 ? (
            <Pressable onPress={clearAllRecent} hitSlop={8}>
              <Text variant="label" bold style={{ color: colors.primary }}>
                {t('search.clearAll', '전체삭제')}
              </Text>
            </Pressable>
          ) : undefined
        }
      />

      {recentSearches.length === 0 ? (
        <View style={styles.centerContainer}>
          <Text variant="bodySecondary">
            {t('search.noRecent', '최근 검색 기록이 없습니다.')}
          </Text>
        </View>
      ) : (
        <FlatList
          data={recentSearches}
          keyExtractor={(item) => String(item.searchId)}
          showsVerticalScrollIndicator={false}
          onRefresh={refetch}
          refreshing={isLoading}
          renderItem={({ item }) => (
            <View style={[styles.historyItem, { borderBottomColor: colors.border }]}>
              <Pressable style={styles.itemTextContainer} onPress={() => handleSearch(item.query)}>
                <Text style={styles.clockIcon}>🕐</Text>
                <Text variant="body" style={[styles.historyText, { color: colors.text }]}>
                  {item.query}
                </Text>
              </Pressable>
              <Pressable style={styles.deleteBtn} onPress={() => removeRecentSearch(item.searchId)} hitSlop={8}>
                <Icon name="close" size={16} color={colors.textSecondary} />
              </Pressable>
            </View>
          )}
          contentContainerStyle={styles.listContent}
        />
      )}
    </ScreenLayout>
  );
};

export { SearchHistoryScreen as default };

const styles = StyleSheet.create({
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContent: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  historyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  itemTextContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  clockIcon: {
    fontSize: 16,
    marginRight: 10,
  },
  historyText: {
    fontSize: 15,
  },
  deleteBtn: {
    padding: 4,
  },
});
