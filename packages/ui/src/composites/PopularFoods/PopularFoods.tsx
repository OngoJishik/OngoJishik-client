import React from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { Text } from '../../primitives/Text';
import { FoodCard } from '../FoodCard/FoodCard';
import { spacing } from '../../../tokens/spacing';
import type { FoodCategory } from '@ongo/utils';

export interface PopularFoodItem {
  id: string;
  nameKo: string;
  nameLocalized?: string;
  emoji: string;
  imageUrl?: string;
  category: FoodCategory;
  description: string;
}

export interface PopularFoodsProps {
  title: string;
  foods: PopularFoodItem[];
  favorites: string[];
  onFoodPress: (id: string) => void;
  onFavoriteToggle: (id: string) => void;
}

/**
 * 인기 전통 음식 섹션 컴포넌트 (가로 스크롤 포함)
 * @author Antigravity
 */
export const PopularFoods: React.FC<PopularFoodsProps> = ({
  title,
  foods,
  favorites,
  onFoodPress,
  onFavoriteToggle,
}) => {
  return (
    <View style={styles.container}>
      <Text variant="h3" bold style={styles.title}>
        {title}
      </Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {foods.map((food) => (
          <FoodCard
            key={food.id}
            id={food.id}
            nameKo={food.nameKo}
            nameLocalized={food.nameLocalized}
            emoji={food.emoji}
            imageUrl={food.imageUrl}
            category={food.category}
            description={food.description}
            isFavorite={favorites.includes(food.id)}
            onPress={() => onFoodPress(food.id)}
            onFavoriteToggle={() => onFavoriteToggle(food.id)}
          />
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: spacing.md,
  },
  title: {
    marginBottom: spacing.md,
  },
  scrollContent: {
    paddingRight: spacing.md,
  },
});
