import React, { useState } from 'react';
import { View, ScrollView, StyleSheet, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { useAtom, useAtomValue } from 'jotai';

import { useTodayRecommendationQuery, usePopularFoodsQuery } from '@ongo/api-client';
import { useTranslation } from '@ongo/i18n';
import { localFavoritesAtom, languageAtom } from '@ongo/store';
import {
  ScreenLayout,
  Header,
  SearchBar,
  FeaturedCard,
  FoodCard,
  CategoryChip,
  Text,
  Icon,
  useTheme,
} from '@ongo/ui';
import { FoodCategory } from '@ongo/utils';

// Mock recommended & today's data for premium visual layout fallbacks
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
  },
  {
    id: 'mandutguk',
    nameKo: '만두국',
    nameLocalized: 'Mandutguk',
    emoji: '🥟',
    category: 'soup' as FoodCategory,
    description: '고기와 야채로 속을 채운 만두를 사골 육수에 끓인 보양 국물 요리.',
  },
  {
    id: 'yakgwa',
    nameKo: '약과',
    nameLocalized: 'Yakgwa',
    emoji: '🍯',
    category: 'hangwa' as FoodCategory,
    description: '밀가루에 참기름, 꿀, 술을 넣고 반죽하여 기름에 지져 낸 고소하고 달콤한 한과.',
  },
];

const CATEGORIES: FoodCategory[] = ['tteok', 'soup', 'grill', 'namul', 'jjim', 'myeon', 'hangwa', 'eumchung'];

/**
 * 서비스의 메인 홈 화면 컴포넌트
 * 오늘의 추천 및 인기 전통 음식을 탐색할 수 있습니다.
 * @author Antigravity
 */
export const HomeScreen = () => {
  const router = useRouter();
  const { colors } = useTheme();
  const { t } = useTranslation();
  const currentLang = useAtomValue(languageAtom);
  const [favorites, setFavorites] = useAtom(localFavoritesAtom);

  const [searchVal, setSearchVal] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<FoodCategory | null>(null);

  // TanStack Query integration with fallbacks for off-line / no-server grace
  const { data: todayRecData } = useTodayRecommendationQuery();
  const { data: popularFoodsData } = usePopularFoodsQuery();

  const todayRecommendation = todayRecData || MOCK_RECOMMENDATION;
  const popularFoods = popularFoodsData || MOCK_FOODS;

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
          <Pressable
            onPress={() => {
              if (__DEV__) {
                console.log('Notifications pressed');
              }
            }}
          >
            <Icon name="bell" size={22} color={colors.text} />
          </Pressable>
        }
      />

      <SearchBar
        value={searchVal}
        onChangeText={setSearchVal}
        onSearch={handleSearch}
        onMicPress={() => {
          if (__DEV__) {
            console.log('Mic Pressed');
          }
        }}
        onClear={() => setSearchVal('')}
      />

      <FeaturedCard
        nameKo={todayRecommendation.nameKo}
        nameLocalized={todayRecommendation.nameLocalized}
        emoji={todayRecommendation.emoji}
        subtitle={'subtitle' in todayRecommendation ? (todayRecommendation.subtitle as string) : t('home.todayRecommendation')}
        description={todayRecommendation.description}
        onPress={() => handleFoodPress(todayRecommendation.id)}
      />

      <View style={styles.sectionHeader}>
        <Text variant="h3" bold>
          {t('home.popularFoods')}
        </Text>
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.horizontalScroll}>
        {popularFoods.map((food) => (
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
          {t('home.categoryExplore')}
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
};

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

export default HomeScreen;

