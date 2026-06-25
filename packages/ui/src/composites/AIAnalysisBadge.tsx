import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text } from '../primitives/Text';
import { Badge } from '../primitives/Badge';
import { useTheme } from '../../theme/useTheme';
import { radius } from '../../tokens/radius';
import { spacing } from '../../tokens/spacing';
import { colors as designColors } from '../../tokens/colors';

export interface AIAnalysisBadgeProps {
  taste?: string | string[];        // "매운맛" 또는 ["매운맛", "단맛"]
  color?: string | string[];        // "빨강" 또는 ["빨강"]
  form?: string | string[];         // "국/탕" 또는 ["국류"]
  resultCount: number;   // 3
  title?: string;
  tasteLabel?: string;
  colorLabel?: string;
  formLabel?: string;
  resultText?: string;
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
  title = '🤖 AI 분석 결과',
  tasteLabel = '맛',
  colorLabel = '색',
  formLabel = '형태',
  resultText,
}) => {
  const { colors } = useTheme();
  
  const displayResultText = resultText || `${resultCount}개의 전통 음식을 찾았습니다.`;

  const displayTaste = Array.isArray(taste) ? taste.slice(0, 2).join(', ') : taste;
  const displayColor = Array.isArray(color) ? color.slice(0, 2).join(', ') : color;
  const displayForm = Array.isArray(form) ? form.slice(0, 2).join(', ') : form;

  return (
    <View style={[styles.container, { backgroundColor: designColors.ai.background, borderColor: designColors.ai.border }]}>
      <Text variant="caption" bold style={[styles.robot, { color: designColors.primary.DEFAULT }]}>
        {title}
      </Text>
      <View style={styles.badgeRow}>
        {displayTaste ? <Badge label={`${tasteLabel}: ${displayTaste}`} variant="info" style={styles.badge} /> : null}
        {displayColor ? <Badge label={`${colorLabel}: ${displayColor}`} variant="warning" style={styles.badge} /> : null}
        {displayForm ? <Badge label={`${formLabel}: ${displayForm}`} variant="success" style={styles.badge} /> : null}
      </View>
      <Text style={[styles.resultText, { color: designColors.green.DEFAULT }]}>
        {displayResultText}
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
