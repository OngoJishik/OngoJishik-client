import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text } from '../primitives/Text';
import { Badge } from '../primitives/Badge';
import { useTheme } from '../../theme/useTheme';
import { radius } from '../../tokens/radius';
import { spacing } from '../../tokens/spacing';

interface AIAnalysisBadgeProps {
  flavor?: string;
  color?: string;
  category?: string;
}

export const AIAnalysisBadge: React.FC<AIAnalysisBadgeProps> = ({ flavor, color, category }) => {
  const { colors } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: colors.primaryLight, borderColor: colors.primary }]}>
      <Text variant="caption" bold style={[styles.robot, { color: colors.primary }]}>
        🤖 AI 분석 결과
      </Text>
      <View style={styles.badgeRow}>
        {flavor && <Badge label={`맛: ${flavor}`} variant="info" style={styles.badge} />}
        {color && <Badge label={`색: ${color}`} variant="warning" style={styles.badge} />}
        {category && <Badge label={`형태: ${category}`} variant="success" style={styles.badge} />}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: spacing.md,
    borderRadius: radius.md,
    borderWidth: 1,
    marginVertical: spacing.sm,
    width: '100%',
  },
  robot: {
    marginBottom: spacing.sm,
  },
  badgeRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  badge: {
    marginRight: spacing.sm,
    marginBottom: spacing.xs,
  },
});
