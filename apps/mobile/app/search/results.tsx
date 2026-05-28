import React from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import {
  ScreenLayout,
  Header,
  FoodResultCard,
  DataSourceTag,
  Text,
} from '@ongo/ui';
import { FoodCategory } from '@ongo/utils';

const MOCK_RESULTS = [
  {
    id: 'yukgaejang',
    nameKo: '육개장',
    nameLocalized: 'Yukgaejang',
    emoji: '🍲',
    category: 'soup' as FoodCategory,
    era: '조선시대',
    description: '매콤하고 깊은 맛의 소고기 국물 요리로 대파와 고사리를 듬뿍 넣어 푹 끓여낸 대표적인 전통 보양식.',
  },
  {
    id: 'gujelpan',
    nameKo: '구절판',
    nameLocalized: 'Gujeolpan',
    emoji: '🍱',
    category: 'tteok' as FoodCategory, // Categorized under generic decorative/wheat wrappers
    era: '조선시대',
    description: '아홉 가지 재료를 둥근 목기에 담아내어 얇은 밀전병에 정성스럽게 싸 먹는 품격 높은 궁중 요리.',
  },
];

export default function SearchResultsScreen() {
  const router = useRouter();
  const { q } = useLocalSearchParams();

  return (
    <ScreenLayout>
      <Header title="검색 결과" onBack={() => router.back()} />

      <View style={styles.queryBar}>
        <Text variant="body" bold style={{ color: '#8C8578' }}>
          입력한 검색어: <Text variant="body" bold style={{ color: '#C85A28' }}>"{q}"</Text>
        </Text>
      </View>

      <FlatList
        data={MOCK_RESULTS}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <FoodResultCard
            id={item.id}
            nameKo={item.nameKo}
            nameLocalized={item.nameLocalized}
            emoji={item.emoji}
            category={item.category}
            era={item.era}
            description={item.description}
            onPress={() => router.push(`/food/${item.id}`)}
          />
        )}
        ListFooterComponent={<DataSourceTag />}
        contentContainerStyle={styles.listContainer}
      />
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  queryBar: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E8E4DD',
    marginBottom: 16,
  },
  listContainer: {
    paddingBottom: 32,
  },
});
