import React from 'react';
import { View, Pressable, StyleSheet } from 'react-native';
import { Text } from '../primitives/Text';
import { Icon } from '../primitives/Icon';
import { useTheme } from '../../theme/useTheme';
import { spacing } from '../../tokens/spacing';
import { radius } from '../../tokens/radius';

interface FeedbackButtonsProps {
  onThumbUp: () => void;
  onThumbDown: () => void;
  selected?: 'up' | 'down' | null;
}

/**
 * 추천된 전통 정보의 유용성 피드백을 수집하기 위한 👍👎 피드백 버튼 컴포넌트
 * @author Antigravity
 */
export const FeedbackButtons: React.FC<FeedbackButtonsProps> = ({
  onThumbUp,
  onThumbDown,
  selected = null,
}) => {
  const { colors } = useTheme();

  return (
    <View style={styles.container}>
      <Text variant="caption" style={[styles.title, { color: colors.textSecondary }]}>
        추천된 정보가 유익하셨나요?
      </Text>
      <View style={styles.row}>
        <Pressable
          style={({ pressed }) => [
            styles.btn,
            { borderColor: colors.border },
            selected === 'up' && { backgroundColor: colors.primaryLight, borderColor: colors.primary },
            pressed && { opacity: 0.8 },
          ]}
          onPress={onThumbUp}
        >
          <Icon name="thumbs-up" size={16} color={selected === 'up' ? colors.primary : colors.textSecondary} />
          <Text variant="caption" style={[styles.btnText, { color: selected === 'up' ? colors.primary : colors.textSecondary }]}>
            유익해요
          </Text>
        </Pressable>

        <Pressable
          style={({ pressed }) => [
            styles.btn,
            { borderColor: colors.border },
            selected === 'down' && { backgroundColor: '#FFEBEE', borderColor: colors.error },
            pressed && { opacity: 0.8 },
          ]}
          onPress={onThumbDown}
        >
          <Icon name="thumbs-down" size={16} color={selected === 'down' ? colors.error : colors.textSecondary} />
          <Text variant="caption" style={[styles.btnText, { color: selected === 'down' ? colors.error : colors.textSecondary }]}>
            부족해요
          </Text>
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: spacing.md,
    alignItems: 'center',
  },
  title: {
    marginBottom: spacing.sm,
  },
  row: {
    flexDirection: 'row',
  },
  btn: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.full,
    marginHorizontal: spacing.xs,
  },
  btnText: {
    marginLeft: spacing.xs,
  },
});
