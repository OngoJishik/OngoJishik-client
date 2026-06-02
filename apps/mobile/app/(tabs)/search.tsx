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
  AIAnalysisBadge,
  Text,
  Chip,
  Icon,
  useTheme,
} from '@ongo/ui';

const RECOMMEND_TAGS = ['#떡국', '#김치찌개', '#비빔밥', '#약과', '#삼계탕', '#구절판'];

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

  // Mock AI matching: if query contains specific terms, show flavor badge
  const showAIBadge = searchVal.includes('매콤') || searchVal.includes('빨간') || searchVal.includes('국물');

  return (
    <ScreenLayout>
      <Header title={t('search.title')} />

      <SearchBar
        value={searchVal}
        onChangeText={setSearchVal}
        onSearch={() => handleSearch(searchVal)}
        onClear={() => setSearchVal('')}
      />

      {showAIBadge && (
        <AIAnalysisBadge
          flavor="매운맛"
          color="빨간색"
          category="국/탕류"
        />
      )}

      <View style={styles.section}>
        <Text variant="h3" bold style={styles.sectionTitle}>
          {t('search.recent')}
        </Text>
        {recentSearches.length === 0 ? (
          <Text variant="caption">{t('search.noRecent')}</Text>
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

      <View style={styles.section}>
        <Text variant="h3" bold style={styles.sectionTitle}>
          {t('search.recommended')}
        </Text>
        <View style={styles.chipGrid}>
          {RECOMMEND_TAGS.map((tag) => (
            <Chip
              key={tag}
              label={tag}
              onPress={() => {
                const cleaned = tag.replace('#', '');
                setSearchVal(cleaned);
                handleSearch(cleaned);
              }}
            />
          ))}
        </View>
      </View>
    </ScreenLayout>
  );
};

const styles = StyleSheet.create({
  section: {
    marginTop: 24,
  },
  sectionTitle: {
    marginBottom: 12,
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
  chipGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
});

export default SearchScreen;

