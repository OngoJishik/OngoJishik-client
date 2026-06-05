import React from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
import { Text } from '../primitives/Text';
import { Card } from '../primitives/Card';
import { useTheme } from '../../theme/useTheme';
import { spacing } from '../../tokens/spacing';

export interface HistorySectionProps {
  type: 'origin' | 'literature' | 'ritual';
  icon: string; // "📜" | "📚" | "🎎"
  title: string; // "유래 이야기", "문헌 기록", "의례와의 연결" 등
  content: string;
  citation?: {
    quote: string;
    source: string;
    onViewOriginal: () => void;
  };
  citationLabel?: string;
  viewOriginalLabel?: string;
}

/**
 * 한국 전통 음식의 유래, 문헌 정보 및 의례 관계 등을 보여주는 역사 정보 카드 컴포넌트
 * @author Antigravity
 */
export const HistorySection: React.FC<HistorySectionProps> = ({
  type,
  icon,
  title,
  content,
  citation,
  citationLabel = '출전',
  viewOriginalLabel = '원문 보기',
}) => {
  const { colors } = useTheme();

  return (
    <Card style={styles.card} bordered>
      <View style={styles.header}>
        <Text style={styles.iconStyle}>{icon}</Text>
        <Text variant="h3" bold style={styles.title}>
          {title}
        </Text>
      </View>
      <Text variant="body" style={[styles.storyText, { color: colors.text }]}>
        {content}
      </Text>
      {type === 'literature' && citation && (
        <View style={[styles.citationContainer, { backgroundColor: colors.primaryLight }]}>
          <Text variant="caption" style={[styles.quote, { color: colors.textSecondary }]}>
            "{citation.quote}"
          </Text>
          <View style={styles.citationFooter}>
            <Text variant="caption" style={{ color: colors.textSecondary, flex: 1, marginRight: spacing.sm }} numberOfLines={1}>
              {citationLabel}: {citation.source}
            </Text>
            <Pressable onPress={citation.onViewOriginal}>
              <Text variant="caption" bold style={{ color: colors.primary }}>
                {viewOriginalLabel} →
              </Text>
            </Pressable>
          </View>
        </View>
      )}
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    marginVertical: spacing.md,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  iconStyle: {
    fontSize: 22,
    marginRight: spacing.sm,
  },
  title: {
    fontSize: 16,
  },
  storyText: {
    lineHeight: 24,
    fontSize: 14,
  },
  citationContainer: {
    marginTop: spacing.md,
    padding: spacing.md,
    borderRadius: 8,
  },
  quote: {
    fontStyle: 'italic',
    marginBottom: spacing.sm,
    lineHeight: 18,
  },
  citationFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});
