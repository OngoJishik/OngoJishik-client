import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text } from '../primitives/Text';
import { useTheme } from '../../theme/useTheme';
import { spacing } from '../../tokens/spacing';
import { radius } from '../../tokens/radius';

export interface RecipeStepProps {
  stepNumber: number;
  title: string;
  description: string;
  isLast: boolean;
}

export const RecipeStep: React.FC<RecipeStepProps> = ({
  stepNumber,
  title,
  description,
  isLast,
}) => {
  const { colors } = useTheme();

  return (
    <View style={styles.container}>
      <View style={styles.leftCol}>
        <View style={[styles.circle, { backgroundColor: colors.primary }]}>
          <Text bold style={{ color: colors.background, fontSize: 12 }}>
            {stepNumber}
          </Text>
        </View>
        {!isLast && <View style={[styles.line, { backgroundColor: colors.border }]} />}
      </View>
      <View style={styles.rightCol}>
        <Text variant="h3" bold style={styles.stepTitle}>
          {title}
        </Text>
        <Text variant="bodySecondary" style={styles.stepDesc}>
          {description}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    marginBottom: spacing.md,
  },
  leftCol: {
    alignItems: 'center',
    marginRight: spacing.md,
  },
  circle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  line: {
    flex: 1,
    width: 2,
    marginVertical: spacing.xs,
  },
  rightCol: {
    flex: 1,
    paddingBottom: spacing.lg,
  },
  stepTitle: {
    fontSize: 15,
  },
  stepDesc: {
    marginTop: spacing.xs,
    fontSize: 13,
  },
});
