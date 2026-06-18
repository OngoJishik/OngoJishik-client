import React, { useState } from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { useSetAtom } from 'jotai';

import { useTranslation } from '@ongo/i18n';
import { recentSearchAtom } from '@ongo/store';
import {
  useSearchHistoryQuery,
  useDeleteAllSearchHistoryMutation,
  useDeleteSearchHistoryMutation,
} from '@ongo/api-client';
import {
  ScreenLayout,
  Header,
  SearchBar,
  Text,
  Icon,
  useTheme,
} from '@ongo/ui';

/**
 * 전통 음식을 검색하는 탭 화면 컴포넌트
 * 최근 검색 기록은 GET /api/searches/recent 서버 API로 관리됩니다.
 * @author Antigravity
 */
export const SearchScreen = () => {
  const router = useRouter();
  const { colors } = useTheme();
  const { t } = useTranslation();
  const [searchVal, setSearchVal] = useState('');

  // 검색어 입력 시 로컬 atom에도 저장 (홈 탭 등 다른 곳에서 참조 가능)
  const addRecentSearch = useSetAtom(recentSearchAtom);

  const { data: historyData } = useSearchHistoryQuery();
  const { mutate: deleteAll } = useDeleteAllSearchHistoryMutation();
  const { mutate: deleteOne } = useDeleteSearchHistoryMutation();

  const recentSearches = historyData?.searches ?? [];

  const handleSearch = (query: string) => {
    const trimmed = query.trim();
    if (trimmed) {
      addRecentSearch(trimmed);
      router.push(`/search/results?q=${encodeURIComponent(trimmed)}`);
      setSearchVal('');
    }
  };

  const clearAllRecent = () => {
    deleteAll();
  };

  const removeRecentSearch = (searchId: number) => {
    deleteOne(searchId);
  };

  return (
    <ScreenLayout>
      <Header title={t('search.title')} titleIcon="search" />

      <SearchBar
        value={searchVal}
        onChangeText={setSearchVal}
        onSearch={() => handleSearch(searchVal)}
        placeholder={t('home.searchPlaceholder')}
        onClear={() => setSearchVal('')}
      />

      <View style={styles.section}>
        <View style={styles.historyHeader}>
          <Text variant="h3" bold style={styles.sectionTitle}>
            {t('search.recent')}
          </Text>
          {recentSearches.length > 0 && (
            <Pressable onPress={clearAllRecent}>
              <Text variant="caption" style={{ color: colors.textTertiary }}>
                {t('search.clearAll')}
              </Text>
            </Pressable>
          )}
        </View>
        {recentSearches.length === 0 ? (
          <Text variant="caption" style={{ color: colors.textSecondary }}>{t('search.noRecent')}</Text>
        ) : (
          recentSearches.map((item) => (
            <View key={item.searchId} style={[styles.historyItem, { borderBottomColor: colors.border }]}>
              <Pressable style={{ flex: 1 }} onPress={() => handleSearch(item.query)}>
                <Text variant="body" style={styles.historyText}>
                  🕐 {item.query}
                </Text>
              </Pressable>
              <Pressable onPress={() => removeRecentSearch(item.searchId)}>
                <Icon name="close" size={14} color={colors.textSecondary} />
              </Pressable>
            </View>
          ))
        )}
      </View>
    </ScreenLayout>
  );
};

const styles = StyleSheet.create({
  section: {
    marginTop: 24,
  },
  historyHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  sectionTitle: {
    marginBottom: 0,
  },
  historyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  historyText: {
    fontSize: 14,
  },
});

export { SearchScreen as default };


