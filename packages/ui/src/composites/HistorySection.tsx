import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text } from '../primitives/Text';
import { Card } from '../primitives/Card';
import { useTheme } from '../../theme/useTheme';
import { spacing } from '../../tokens/spacing';

interface HistorySectionProps {
  era?: string;
  story: string;
}

export const HistorySection: React.FC<HistorySectionProps> = ({ era, story }) => {
  const { colors } = useTheme();

  return (
    <Card style={styles.card} bordered>
      <View style={styles.header}>
        <Text style={styles.bookIcon}>📖</Text>
        <Text variant="h3" bold style={styles.title}>
          역사 이야기 {era ? `(${era})` : ''}
        </Text>
      </View>
      <Text variant="body" style={[styles.storyText, { color: colors.text }]}>
        {story}
      </Text>
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
  bookIcon: {
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
});
