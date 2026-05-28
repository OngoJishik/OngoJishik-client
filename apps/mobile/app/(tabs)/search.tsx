import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import {
  ScreenLayout,
  Header,
  SearchBar,
  AIAnalysisBadge,
  Text,
  Chip,
  Icon,
} from '@ongo/ui';
import { spacing } from '@ongo/ui';

const RECOMMEND_TAGS = ['#떡국', '#김치찌개', '#비빔밥', '#약과', '#삼계탕', '#구절판'];

export default function SearchScreen() {
  const router = useRouter();
  const [searchVal, setSearchVal] = useState('');
  const [recentSearches, setRecentSearches] = useState([
    '설날에 먹는 음식',
    '궁중 요리 추천',
    '전통 차',
  ]);

  const handleSearch = (query: string) => {
    if (query.trim()) {
      if (!recentSearches.includes(query.trim())) {
        setRecentSearches((prev) => [query.trim(), ...prev].slice(0, 5));
      }
      router.push(`/search/results?q=${query}`);
    }
  };

  const removeRecentSearch = (item: string) => {
    setRecentSearches((prev) => prev.filter((s) => s !== item));
  };

  // Mock AI matching: if query contains "매콤" or "빨간", show flavor badge
  const showAIBadge = searchVal.includes('매콤') || searchVal.includes('빨간') || searchVal.includes('국물');

  return (
    <ScreenLayout>
      <Header title="🔍 검색" />

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
          최근 검색어
        </Text>
        {recentSearches.length === 0 ? (
          <Text variant="caption">최근 검색 기록이 없습니다.</Text>
        ) : (
          recentSearches.map((item, index) => (
            <View key={index} style={styles.historyItem}>
              <TouchableOpacity style={{ flex: 1 }} onPress={() => handleSearch(item)}>
                <Text variant="body" style={styles.historyText}>
                  🕐 {item}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => removeRecentSearch(item)}>
                <Icon name="close" size={14} color="#8C8578" />
              </TouchableOpacity>
            </View>
          ))
        )}
      </View>

      <View style={styles.section}>
        <Text variant="h3" bold style={styles.sectionTitle}>
          추천 검색어
        </Text>
        <View style={styles.chipGrid}>
          {RECOMMEND_TAGS.map((tag) => (
            <Chip
              key={tag}
              label={tag}
              onPress={() => {
                setSearchVal(tag.replace('#', ''));
                handleSearch(tag.replace('#', ''));
              }}
            />
          ))}
        </View>
      </View>
    </ScreenLayout>
  );
}

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
    borderBottomColor: '#E8E4DD',
  },
  historyText: {
    fontSize: 14,
  },
  chipGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
});
