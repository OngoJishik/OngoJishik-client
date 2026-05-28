import React from 'react';
import { View, ViewStyle, StyleSheet } from 'react-native';
import { useTheme } from '../../theme/useTheme';
import { radius } from '../../tokens/radius';
import { spacing } from '../../tokens/spacing';
import { shadows } from '../../tokens/shadows';

export interface CardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  bordered?: boolean;
}

export const Card: React.FC<CardProps> = ({ children, style, bordered = false }) => {
  const { colors } = useTheme();

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: colors.card,
          borderColor: colors.border,
          borderWidth: bordered ? 1 : 0,
        },
        !bordered && shadows.sm,
        style,
      ]}
    >
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: radius.lg,
    padding: spacing.lg,
  },
});
