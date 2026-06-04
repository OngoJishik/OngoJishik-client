import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text } from '../primitives/Text';
import { Badge } from '../primitives/Badge';
import { useTheme } from '../../theme/useTheme';
import { radius } from '../../tokens/radius';
import { spacing } from '../../tokens/spacing';
import { colors as designColors } from '../../tokens/colors';

export interface AIAnalysisBadgeProps {
  taste?: string;        // "매운맛"
  color?: string;        // "빨강"
  form?: string;         // "국/탕"
  resultCount: number;   // 3
}

/**
 * 검색 결과 화면에 노출되는 AI 분석결과 배지 컴포넌트
 * @author Antigravity
 */
export const AIAnalysisBadge: React.FC<AIAnalysisBadgeProps> = ({
  taste,
  color,
  form,
  resultCount,
}) => {
  const { colors } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: designColors.ai.background, borderColor: designColors.ai.border }]}>
      <Text variant="caption" bold style={[styles.robot, { color: designColors.primary.DEFAULT }]}>
        🤖 AI 분석 결과
      </Text>
      <View style={styles.badgeRow}>
        {taste && <Badge label={`맛: ${taste}`} variant="info" style={styles.badge} />}
        {color && <Badge label={`색: ${color}`} variant="warning" style={styles.badge} />}
        {form && <Badge label={`형태: ${form}`} variant="success" style={styles.badge} />}
      </View>
      <Text style={[styles.resultText, { color: designColors.green.DEFAULT }]}>
        {resultCount}개의 전통 음식을 찾았습니다.
      </Text>
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
    fontSize: 13,
    fontWeight: '600',
    marginBottom: spacing.sm,
  },
  badgeRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: spacing.sm,
  },
  badge: {
    marginRight: spacing.sm,
    marginBottom: spacing.xs,
  },
  resultText: {
    fontSize: 12,
    fontWeight: '600',
  },
});
