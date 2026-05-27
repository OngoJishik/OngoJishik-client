import React from 'react';
import { TouchableOpacity, StyleSheet, ActivityIndicator, ViewStyle } from 'react-native';
import { Text } from './Text';
import { useTheme } from '../../theme/useTheme';
import { radius } from '../../tokens/radius';
import { spacing } from '../../tokens/spacing';

export interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline';
  loading?: boolean;
  disabled?: boolean;
  style?: ViewStyle;
}

export const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  loading = false,
  disabled = false,
  style,
}) => {
  const { colors } = useTheme();

  const getStyles = () => {
    const base: ViewStyle = {
      paddingVertical: spacing.md,
      paddingHorizontal: spacing.xl,
      borderRadius: radius.md,
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'row',
      opacity: disabled ? 0.5 : 1,
    };

    if (variant === 'primary') {
      return {
        view: { ...base, backgroundColor: colors.primary },
        text: { color: colors.background },
      };
    } else if (variant === 'secondary') {
      return {
        view: { ...base, backgroundColor: colors.secondary },
        text: { color: colors.background },
      };
    } else {
      return {
        view: { ...base, backgroundColor: 'transparent', borderWidth: 1, borderColor: colors.primary },
        text: { color: colors.primary },
      };
    }
  };

  const buttonStyles = getStyles();

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || loading}
      style={[buttonStyles.view, style]}
      activeOpacity={0.8}
    >
      {loading ? (
        <ActivityIndicator color={buttonStyles.text.color} size="small" />
      ) : (
        <Text style={buttonStyles.text} bold variant="label">
          {title}
        </Text>
      )}
    </TouchableOpacity>
  );
};
