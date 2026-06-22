import React from 'react';
import { View, StyleSheet, Pressable, ActivityIndicator } from 'react-native';
import { Image } from 'expo-image';
import { Text } from '../primitives/Text';
import { Card } from '../primitives/Card';
import { useTheme } from '../../theme/useTheme';
import { FoodCategory, foodCategoryNames, formatFoodName } from '@ongo/utils';
import { radius } from '../../tokens/radius';
import { spacing } from '../../tokens/spacing';

import { Icon } from '../primitives/Icon';
import { colors as designColors } from '../../tokens/colors';

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
  imageStatus?: 'PENDING' | 'COMPLETED' | 'FAILED';
}

/**
 * 음식 검색 결과 목록 또는 즐겨찾기 목록에서 사용되는 가로형 카드 컴포넌트
 * @author Antigravity
 */
export const FoodResultCard: React.FC<FoodResultCardProps> = ({
  nameKo,
  nameLocalized,
  emoji,
  imageUrl,
  category,
  era,
  description,
  onPress,
  imageStatus,
}) => {
  const { colors } = useTheme();

  const categoryName = foodCategoryNames[category]?.ko || category;

  return (
    <Pressable onPress={onPress} style={styles.container}>
      <Card style={styles.card} bordered>
        <View style={styles.row}>
          <View style={[styles.imageWrapper, { backgroundColor: colors.primaryLight }]}>
            {imageStatus === 'PENDING' ? (
              <ActivityIndicator size="small" color={designColors.primary.DEFAULT} />
            ) : imageUrl ? (
              <Image source={{ uri: imageUrl }} style={styles.image} contentFit="cover" transition={200} />
            ) : (
              <Text style={styles.emoji}>{emoji}</Text>
            )}
            {era && (
              <View style={[styles.eraBadge, { backgroundColor: colors.secondary }]}>
                <Text style={[styles.eraText, { color: designColors.white }]} bold>
                  {era}
                </Text>
              </View>
            )}
          </View>
          <View style={styles.infoWrapper}>
            <View style={[styles.categoryChip, { backgroundColor: colors.primaryLight }]}>
              <Text variant="caption" style={[styles.categoryChipText, { color: colors.textSecondary }]}>
                {categoryName}
              </Text>
            </View>
            <View style={styles.titleRow}>
              <Text variant="h3" bold style={[styles.title, { color: colors.text }]}>
                {nameKo}
              </Text>
              {nameLocalized && (
                <Text variant="caption" style={[styles.romanized, { color: colors.textTertiary }]}>
                  {nameLocalized}
                </Text>
              )}
            </View>
            <Text variant="caption" numberOfLines={2} style={[styles.description, { color: colors.textSecondary }]}>
              {description}
            </Text>
          </View>
          <Icon name="chevron-right" size={16} color={colors.textTertiary} style={styles.arrow} />
        </View>
      </Card>
    </Pressable>
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
  eraText: {
    fontSize: 8,
  },
  infoWrapper: {
    flex: 1,
    marginLeft: spacing.md,
  },
  categoryChip: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: radius.sm,
    alignSelf: 'flex-start',
  },
  categoryChipText: {
    fontSize: 10,
    fontWeight: 'bold',
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginVertical: spacing.xs,
  },
  title: {
    fontSize: 15,
  },
  romanized: {
    fontSize: 11,
    marginLeft: spacing.xs,
  },
  description: {
    fontSize: 12,
  },
  arrow: {
    marginLeft: spacing.sm,
  },
});
