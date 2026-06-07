import React from 'react';
import { FlatList, View, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useAtomValue } from 'jotai';

import { useTranslation } from '@ongo/i18n';
import { localFavoritesAtom } from '@ongo/store';
import {
  ScreenLayout,
  Header,
  FoodResultCard,
  Text,
} from '@ongo/ui';

import { MOCK_FOODS } from '../mocks';

/**
 * 즐겨찾기 음식 목록 화면 컴포넌트
 * 마이페이지 등에서 이동할 수 있으며, 사용자가 즐겨찾기(하트)를 등록한 전통 음식 목록을 렌더링합니다.
 * @author Antigravity
 */
export const FavoritesScreen = () => {
  const router = useRouter();
  const { t } = useTranslation();
  const favorites = useAtomValue(localFavoritesAtom);

  const favoriteFoods = MOCK_FOODS.filter((food) => favorites.includes(food.id));

  return (
    <ScreenLayout>
      <Header title={`★ ${t('favorites.title')}`} onBack={() => router.back()} />

      {favoriteFoods.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text variant="bodySecondary">{t('favorites.empty')}</Text>
        </View>
      ) : (
        <FlatList
          data={favoriteFoods}
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
          contentContainerStyle={styles.listContent}
        />
      )}
    </ScreenLayout>
  );
};

export { FavoritesScreen as default };

const styles = StyleSheet.create({
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContent: {
    paddingVertical: 16,
  },
});
