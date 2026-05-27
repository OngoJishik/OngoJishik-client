import React from 'react';
import { TouchableOpacity, StyleSheet, View } from 'react-native';
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

export const CategoryChip: React.FC<CategoryChipProps> = ({ category, selected = false, onPress }) => {
  const { colors } = useTheme();

  const info = foodCategoryNames[category];
  const emoji = foodCategoryEmojis[category];
  const categoryColor = designColors.category[category] || colors.primary;

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.8}
      style={[
        styles.chip,
        {
          backgroundColor: selected ? categoryColor : colors.card,
          borderColor: selected ? categoryColor : colors.border,
        },
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
    </TouchableOpacity>
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
