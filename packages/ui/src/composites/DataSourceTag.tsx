import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text } from '../primitives/Text';
import { useTheme } from '../../theme/useTheme';
import { radius } from '../../tokens/radius';
import { spacing } from '../../tokens/spacing';
import { colors as designColors } from '../../tokens/colors';

interface DataSourceTagProps {
  source?: string;
}

export const DataSourceTag: React.FC<DataSourceTagProps> = ({
  source = '특허청 한국전통지식포탈',
}) => {
  const { colors } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: designColors.neutral[100], borderColor: colors.border }]}>
      <Text style={styles.icon}>📋</Text>
      <Text variant="caption" bold style={{ color: colors.textSecondary }}>
        출처: {source}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.md,
    borderWidth: 1,
    alignSelf: 'flex-start',
    marginVertical: spacing.sm,
  },
  icon: {
    marginRight: spacing.xs,
    fontSize: 12,
  },
});
