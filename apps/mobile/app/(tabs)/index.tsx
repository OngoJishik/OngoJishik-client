import React, { useState } from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
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
  PopularFoods,
  CategoryChip,
  Text,
  Icon,
  useTheme,
} from '@ongo/ui';
import { FoodCategory } from '@ongo/utils';

import { MOCK_RECOMMENDATION, MOCK_FOODS } from '../../mocks';

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

      <PopularFoods
        title={t('home.popularFoods')}
        foods={popularFoods}
        favorites={favorites}
        onFoodPress={handleFoodPress}
        onFavoriteToggle={handleFavoriteToggle}
      />

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

