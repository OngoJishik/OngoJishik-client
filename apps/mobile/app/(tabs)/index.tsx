import React, { useState } from 'react';
import { View, ScrollView, StyleSheet, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { useAtom } from 'jotai';
import {
  ScreenLayout,
  Header,
  SearchBar,
  FeaturedCard,
  FoodCard,
  CategoryChip,
  Text,
  Icon,
} from '@ongo/ui';
import { FoodCategory, foodCategoryNames } from '@ongo/utils';

// Mock recommended & today's data for premium visual layout
const MOCK_RECOMMENDATION = {
  id: 'gujelpan',
  nameKo: '구절판',
  nameLocalized: 'Gujeolpan',
  emoji: '🍱',
  subtitle: '아홉 가지 재료를 담은 궁중 요리',
  description: '밀전병을 중심에 두고 주위에 여덟 가지 고명(고기, 미나리, 버섯, 지단 등)을 채워 가며 싸 먹는 호화로운 조선 시대 궁중 음식입니다.',
};

const MOCK_FOODS = [
  {
    id: 'sinseollo',
    nameKo: '신선로',
    nameLocalized: 'Sinseollo',
    emoji: '🫕',
    category: 'soup' as FoodCategory,
    description: '여러 가지 어육과 채소를 신선로틀에 돌려 담고 장국을 부어 끓여 먹는 궁중 전골.',
    isFavorite: true,
  },
  {
    id: 'mandutguk',
    nameKo: '만두국',
    nameLocalized: 'Mandutguk',
    emoji: '🥟',
    category: 'soup' as FoodCategory,
    description: '고기와 야채로 속을 채운 만두를 사골 육수에 끓인 보양 국물 요리.',
    isFavorite: false,
  },
  {
    id: 'yakgwa',
    nameKo: '약과',
    nameLocalized: 'Yakgwa',
    emoji: '🍯',
    category: 'hangwa' as FoodCategory,
    description: '밀가루에 참기름, 꿀, 술을 넣고 반죽하여 기름에 지져 낸 고소하고 달콤한 한과.',
    isFavorite: true,
  },
];

const CATEGORIES: FoodCategory[] = ['tteok', 'soup', 'grill', 'namul', 'jjim', 'myeon', 'hangwa', 'eumchung'];

export default function HomeScreen() {
  const router = useRouter();
  const [searchVal, setSearchVal] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<FoodCategory | null>(null);
  const [favorites, setFavorites] = useState<string[]>(['sinseollo', 'yakgwa']);

  const handleFoodPress = (id: string) => {
    router.push(`/food/${id}`);
  };

  const handleFavoriteToggle = (id: string) => {
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((favId) => favId !== id) : [...prev, id]
    );
  };

  const handleSearch = () => {
    if (searchVal.trim()) {
      router.push(`/search/results?q=${searchVal}`);
    }
  };

  return (
    <ScreenLayout scrollable>
      <Header
        title="🍚 온고지식"
        rightAction={
          <Pressable onPress={() => console.log('Notifications')}>
            <Icon name="bell" size={22} />
          </Pressable>
        }
      />

      <SearchBar
        value={searchVal}
        onChangeText={setSearchVal}
        onSearch={handleSearch}
        onMicPress={() => console.log('Mic Pressed')}
        onClear={() => setSearchVal('')}
      />

      <FeaturedCard
        nameKo={MOCK_RECOMMENDATION.nameKo}
        nameLocalized={MOCK_RECOMMENDATION.nameLocalized}
        emoji={MOCK_RECOMMENDATION.emoji}
        subtitle={MOCK_RECOMMENDATION.subtitle}
        description={MOCK_RECOMMENDATION.description}
        onPress={() => handleFoodPress(MOCK_RECOMMENDATION.id)}
      />

      <View style={styles.sectionHeader}>
        <Text variant="h3" bold>
          인기 전통 음식
        </Text>
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.horizontalScroll}>
        {MOCK_FOODS.map((food) => (
          <FoodCard
            key={food.id}
            id={food.id}
            nameKo={food.nameKo}
            nameLocalized={food.nameLocalized}
            emoji={food.emoji}
            category={food.category}
            description={food.description}
            isFavorite={favorites.includes(food.id)}
            onPress={() => handleFoodPress(food.id)}
            onFavoriteToggle={() => handleFavoriteToggle(food.id)}
          />
        ))}
      </ScrollView>

      <View style={styles.sectionHeader}>
        <Text variant="h3" bold>
          카테고리 탐색
        </Text>
      </View>

      <View style={styles.categoryGrid}>
        {CATEGORIES.map((cat) => (
          <CategoryChip
            key={cat}
            category={cat}
            selected={selectedCategory === cat}
            onPress={() => setSelectedCategory(selectedCategory === cat ? null : cat)}
          />
        ))}
      </View>
    </ScreenLayout>
  );
}



const styles = StyleSheet.create({
  sectionHeader: {
    marginVertical: 16,
  },
  horizontalScroll: {
    paddingBottom: 8,
  },
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
});
