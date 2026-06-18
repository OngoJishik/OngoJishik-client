import React from 'react';
import { FlatList, View, StyleSheet, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';

import { useTranslation } from '@ongo/i18n';
import { useFavoritesQuery } from '@ongo/api-client';
import {
  ScreenLayout,
  Header,
  FoodResultCard,
  Text,
} from '@ongo/ui';
import { colors as designColors } from '@ongo/ui';

/**
 * 즐겨찾기 음식 목록 화면 컴포넌트
 * GET /api/bookmarks 를 통해 서버에서 즐겨찾기 목록을 가져와 렌더링합니다.
 * @author Antigravity
 */
export const FavoritesScreen = () => {
  const router = useRouter();
  const { t } = useTranslation();
  const { data: bookmarks, isLoading, isError } = useFavoritesQuery();

  const renderContent = () => {
    if (isLoading) {
      return (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color={designColors.primary.DEFAULT} />
        </View>
      );
    }

    if (isError) {
      return (
        <View style={styles.centerContainer}>
          <Text variant="bodySecondary">{t('favorites.error', { defaultValue: '즐겨찾기를 불러오지 못했어요.' })}</Text>
        </View>
      );
    }

    const favoriteFoods = bookmarks ?? [];

    if (favoriteFoods.length === 0) {
      return (
        <View style={styles.emptyContainer}>
          <Text variant="bodySecondary">{t('favorites.empty')}</Text>
        </View>
      );
    }

    return (
      <FlatList
        data={favoriteFoods}
        keyExtractor={(item) => item.foodId}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <FoodResultCard
            id={item.foodId}
            nameKo={item.foodName}
            nameLocalized={undefined}
            emoji={'🍲'}
            category={item.category as Parameters<typeof FoodResultCard>[0]['category']}
            era={undefined}
            description={Array.isArray(item.features) ? item.features.join(', ') : ''}
            onPress={() => router.push(`/food/${item.foodId}`)}
          />
        )}
        contentContainerStyle={styles.listContent}
      />
    );
  };

  return (
    <ScreenLayout>
      <Header title={t('favorites.title')} titleIcon="star-filled" onBack={() => router.back()} />
      {renderContent()}
    </ScreenLayout>
  );
};

export { FavoritesScreen as default };

const styles = StyleSheet.create({
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContent: {
    paddingVertical: 16,
  },
});

