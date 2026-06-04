import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { Text } from '../primitives/Text';
import { useTheme } from '../../theme/useTheme';
import { FoodCategory, foodCategoryNames, foodCategoryEmojis } from '@ongo/utils';
import { colors as designColors } from '../../tokens/colors';
import { radius } from '../../tokens/radius';
import { spacing } from '../../tokens/spacing';

interface CategoryChipProps {
  category: FoodCategory;
  selected?: boolean;
  onPress: () => void;
}

/**
 * 카테고리별 요리를 선택할 때 사용하는 카테고리 칩 컴포넌트
 * 이모지와 한국어 카테고리명을 결합하여 카드 선택 피드백을 제공합니다.
 * @author Antigravity
 */
export const CategoryChip: React.FC<CategoryChipProps> = ({ category, selected = false, onPress }) => {
  const { colors } = useTheme();

  const info = foodCategoryNames[category];
  const emoji = foodCategoryEmojis[category];
  const categoryColor = designColors.category[category] || colors.primary;

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.chip,
        {
          backgroundColor: selected ? categoryColor : colors.card,
          borderColor: selected ? categoryColor : colors.border,
        },
        pressed && { opacity: 0.8 },
      ]}
    >
      <View style={styles.content}>
        <Text style={styles.emoji}>{emoji}</Text>
        <Text
          variant="caption"
          bold
          style={{ color: selected ? colors.background : colors.text, marginLeft: spacing.xs }}
        >
          {info?.ko}
        </Text>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  chip: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.full,
    borderWidth: 1,
    marginRight: spacing.sm,
    marginBottom: spacing.sm,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  emoji: {
    fontSize: 14,
  },
});
