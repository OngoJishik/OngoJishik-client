import React from 'react';
import { View, ViewStyle, StyleSheet } from 'react-native';
import { Text } from './Text';
import { useTheme } from '../../theme/useTheme';
import { radius } from '../../tokens/radius';
import { spacing } from '../../tokens/spacing';

export interface BadgeProps {
  label: string;
  variant?: 'primary' | 'secondary' | 'success' | 'error' | 'warning' | 'info';
  style?: ViewStyle;
}

export const Badge: React.FC<BadgeProps> = ({ label, variant = 'primary', style }) => {
  const { colors } = useTheme();

  const getColors = () => {
    switch (variant) {
      case 'secondary':
        return { bg: colors.primaryLight, text: colors.primary };
      case 'success':
        return { bg: '#E8F5E9', text: colors.success };
      case 'error':
        return { bg: '#FFEBEE', text: colors.error };
      case 'warning':
        return { bg: '#FFFDE7', text: colors.warning };
      case 'info':
        return { bg: '#E3F2FD', text: colors.info };
      case 'primary':
      default:
        return { bg: colors.primary, text: colors.background };
    }
  };

  const badgeColors = getColors();

  return (
    <View style={[styles.badge, { backgroundColor: badgeColors.bg }, style]}>
      <Text style={[styles.text, { color: badgeColors.text }]} bold variant="caption">
        {label}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: radius.sm,
    alignSelf: 'flex-start',
  },
  text: {
    fontSize: 10,
  },
});
