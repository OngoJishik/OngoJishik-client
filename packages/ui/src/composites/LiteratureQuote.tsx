import React from 'react';
import { View, StyleSheet } from 'react-native';
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
}

export const LiteratureQuote: React.FC<LiteratureQuoteProps> = ({
  sourceName,
  quoteOriginal,
  quoteTranslation,
  era,
}) => {
  const { colors } = useTheme();

  return (
    <Card style={StyleSheet.flatten([styles.card, { backgroundColor: designColors.neutral[100] }])} bordered>
      <View style={styles.header}>
        <View style={[styles.badge, { backgroundColor: colors.primary }]}>
          <Text style={{ color: colors.background, fontSize: 10 }} bold>
            {era}
          </Text>
        </View>
        <Text variant="label" bold style={styles.source}>
          {sourceName}
        </Text>
      </View>
      <View style={[styles.quoteWrapper, { borderLeftColor: colors.primary }]}>
        <Text variant="body" bold style={StyleSheet.flatten([styles.original, { color: colors.text, fontStyle: 'italic' }])}>
          "{quoteOriginal}"
        </Text>
        {quoteTranslation && (
          <Text variant="caption" style={StyleSheet.flatten([styles.translation, { color: colors.textSecondary }])}>
            현대어 풀이: {quoteTranslation}
          </Text>
        )}
      </View>
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
});
