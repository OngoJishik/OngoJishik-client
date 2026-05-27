import React from 'react';
import { View, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { Text } from '../primitives/Text';
import { Card } from '../primitives/Card';
import { Badge } from '../primitives/Badge';
import { useTheme } from '../../theme/useTheme';
import { FoodCategory, foodCategoryNames, formatFoodName } from '@ongo/utils';
import { radius } from '../../tokens/radius';
import { spacing } from '../../tokens/spacing';

export interface FoodResultCardProps {
  id: string;
  nameKo: string;
  nameLocalized?: string;
  emoji: string;
  imageUrl?: string;
  category: FoodCategory;
  era?: string;
  description: string;
  onPress: () => void;
}

export const FoodResultCard: React.FC<FoodResultCardProps> = ({
  nameKo,
  nameLocalized,
  emoji,
  imageUrl,
  category,
  era,
  description,
  onPress,
}) => {
  const { colors } = useTheme();

  const categoryName = foodCategoryNames[category]?.ko || category;
  const displayName = formatFoodName(nameKo, nameLocalized);

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.8} style={styles.container}>
      <Card style={styles.card} bordered>
        <View style={styles.row}>
          <View style={[styles.imageWrapper, { backgroundColor: colors.primaryLight }]}>
            {imageUrl ? (
              <Image source={{ uri: imageUrl }} style={styles.image} />
            ) : (
              <Text style={styles.emoji}>{emoji}</Text>
            )}
            {era && (
              <View style={[styles.eraBadge, { backgroundColor: colors.primary }]}>
                <Text style={{ color: colors.background, fontSize: 8 }} bold>
                  {era}
                </Text>
              </View>
            )}
          </View>
          <View style={styles.infoWrapper}>
            <Text variant="caption" style={{ color: colors.secondary }} bold>
              {categoryName}
            </Text>
            <Text variant="h3" bold style={styles.title}>
              {displayName}
            </Text>
            <Text variant="caption" numberOfLines={2} style={styles.description}>
              {description}
            </Text>
          </View>
        </View>
      </Card>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.md,
    width: '100%',
  },
  card: {
    padding: spacing.md,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  imageWrapper: {
    width: 70,
    height: 70,
    borderRadius: radius.md,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  emoji: {
    fontSize: 28,
  },
  eraBadge: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    alignItems: 'center',
    paddingVertical: 1,
  },
  infoWrapper: {
    flex: 1,
    marginLeft: spacing.md,
  },
  title: {
    marginVertical: spacing.xs,
    fontSize: 15,
  },
  description: {
    fontSize: 12,
  },
});
