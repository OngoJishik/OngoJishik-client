import React, { useState } from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { useAtom, useSetAtom } from 'jotai';

import { useTranslation } from '@ongo/i18n';
import { recentSearchAtom, searchHistoryAtom } from '@ongo/store';
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
 * @author Antigravity
 */
export const SearchScreen = () => {
  const router = useRouter();
  const { colors } = useTheme();
  const { t } = useTranslation();
  const [searchVal, setSearchVal] = useState('');
  
  const [recentSearches, setRecentSearches] = useAtom(searchHistoryAtom);
  const addRecentSearch = useSetAtom(recentSearchAtom);

  const handleSearch = (query: string) => {
    const trimmed = query.trim();
    if (trimmed) {
      addRecentSearch(trimmed);
      router.push(`/search/results?q=${trimmed}`);
    }
  };

  const removeRecentSearch = (item: string) => {
    setRecentSearches((prev) => prev.filter((s) => s !== item));
  };

  const clearAllRecent = () => {
    setRecentSearches([]);
  };

  return (
    <ScreenLayout>
      <Header title={t('search.title')} />

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
          recentSearches.map((item, index) => (
            <View key={index} style={[styles.historyItem, { borderBottomColor: colors.border }]}>
              <Pressable style={{ flex: 1 }} onPress={() => handleSearch(item)}>
                <Text variant="body" style={styles.historyText}>
                  🕐 {item}
                </Text>
              </Pressable>
              <Pressable onPress={() => removeRecentSearch(item)}>
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

