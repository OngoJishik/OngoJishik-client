import React from 'react';
import { View, StyleSheet, Pressable, Linking } from 'react-native';
import { Text } from '../primitives/Text';
import { Card } from '../primitives/Card';
import { useTheme } from '../../theme/useTheme';
import { spacing } from '../../tokens/spacing';
import { radius } from '../../tokens/radius';
import { colors as designColors } from '../../tokens/colors';

interface LiteratureQuoteProps {
  sourceName: string;
  quoteOriginal: string;
  quoteTranslation?: string;
  era: string;
  translationLabel?: string;
  author?: string;
  publishYear?: string;
  originalUrl?: string;
}

/**
 * 고문헌 기록 인용 카드 컴포넌트
 * 저자, 발행년도 및 원문 URL 바로가기 기능을 포함합니다.
 * @author Antigravity
 */
export const LiteratureQuote: React.FC<LiteratureQuoteProps> = ({
  sourceName,
  quoteOriginal,
  quoteTranslation,
  era,
  translationLabel = '현대어 풀이',
  author,
  publishYear,
  originalUrl,
}) => {
  const { colors } = useTheme();

  return (
    <Card style={StyleSheet.flatten([styles.card, { backgroundColor: designColors.neutral[100] }])} bordered>
      <View style={styles.header}>
        <View style={[styles.badge, { backgroundColor: colors.secondary }]}>
          <Text style={[styles.badgeText, { color: designColors.white }]} bold>
            {era}
          </Text>
        </View>
        <Text variant="label" bold style={[styles.source, { color: colors.text, flex: 1 }]}>
          {sourceName}
          {(author || publishYear) && (
            <Text variant="caption" style={{ color: colors.textSecondary, fontWeight: 'normal' }}>
              {` (${[author, publishYear].filter(Boolean).join(' | ')})`}
            </Text>
          )}
        </Text>
      </View>
      <View style={[styles.quoteWrapper, { borderLeftColor: colors.primary }]}>
        <Text variant="body" bold style={StyleSheet.flatten([styles.original, { color: colors.text, fontStyle: 'italic' }])}>
          "{quoteOriginal}"
        </Text>
        {quoteTranslation && (
          <Text variant="caption" style={StyleSheet.flatten([styles.translation, { color: colors.textSecondary }])}>
            {translationLabel}: {quoteTranslation}
          </Text>
        )}
      </View>
      {originalUrl && (
        <View style={styles.linkWrapper}>
          <Pressable
            onPress={() => {
              Linking.openURL(originalUrl).catch((err) => {
                if (__DEV__) {
                  console.warn('Failed to open URL:', err);
                }
              });
            }}
            style={({ pressed }) => [
              styles.linkButton,
              pressed && { opacity: 0.6 }
            ]}
          >
            <Text variant="caption" bold style={{ color: colors.primary }}>
              원문 바로가기 ↗
            </Text>
          </Pressable>
        </View>
      )}
    </Card>
  );
};

const styles = StyleSheet.create({
  card: {
    marginVertical: spacing.sm,
    padding: spacing.md,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  badge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: radius.sm,
    marginRight: spacing.sm,
  },
  badgeText: {
    fontSize: 10,
  },
  source: {
    fontSize: 14,
  },
  quoteWrapper: {
    borderLeftWidth: 3,
    paddingLeft: spacing.md,
    marginVertical: spacing.xs,
  },
  original: {
    fontSize: 14,
    lineHeight: 20,
  },
  translation: {
    marginTop: spacing.sm,
    lineHeight: 18,
  },
  linkWrapper: {
    alignItems: 'flex-end',
    marginTop: spacing.sm,
  },
  linkButton: {
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.sm,
  },
});
