import React from 'react';
import { View, Pressable } from 'react-native';
import { Image } from 'expo-image';

import { useTheme } from '../../../theme/useTheme';
import { foodCategoryNames, formatFoodName } from '@ongo/utils';
import { Card } from '../../primitives/Card';
import { Icon } from '../../primitives/Icon';
import { Text } from '../../primitives/Text';
import { styles } from './FoodCard.styles';

import type { FoodCategory } from '@ongo/utils';

export type FoodCardProps = {
  id: string;
  nameKo: string;
  nameLocalized?: string;
  emoji: string;
  imageUrl?: string;
  category: FoodCategory;
  description: string;
  isFavorite: boolean;
  onPress: () => void;
  onFavoriteToggle: () => void;
};

/**
 * 전통 음식을 카드 형태로 표시하는 컴포넌트
 * @author Antigravity
 */
export const FoodCard = ({
  nameKo,
  nameLocalized,
  emoji,
  imageUrl,
  category,
  description,
  isFavorite,
  onPress,
  onFavoriteToggle,
}: FoodCardProps) => {
  const { colors } = useTheme();
  
  const categoryName = foodCategoryNames[category]?.ko || category;
  const displayName = formatFoodName(nameKo, nameLocalized);

  return (
    <Pressable onPress={onPress} style={styles.container}>
      <Card style={styles.card}>
        <View style={[styles.imageContainer, { backgroundColor: colors.primaryLight }]}>
          {imageUrl ? (
            <Image
              source={{ uri: imageUrl }}
              style={styles.image}
              contentFit="cover"
              transition={200}
            />
          ) : (
            <Text style={styles.emoji}>{emoji}</Text>
          )}
          <Pressable
            style={[styles.favoriteBtn, { backgroundColor: colors.card }]}
            onPress={(e) => {
              e.stopPropagation();
              onFavoriteToggle();
            }}
          >
            <Icon
              name={isFavorite ? 'heart-filled' : 'heart'}
              size={18}
              color={isFavorite ? colors.primary : colors.textSecondary}
            />
          </Pressable>
        </View>
        <View style={styles.infoContainer}>
          <Text variant="caption" style={{ color: colors.primary }} bold>
            {categoryName}
          </Text>
          <Text variant="label" bold numberOfLines={1} style={styles.title}>
            {displayName}
          </Text>
          <Text variant="caption" numberOfLines={2} style={styles.description}>
            {description}
          </Text>
        </View>
      </Card>
    </Pressable>
  );
};
