import React from 'react';
import { Text as RNText, TextProps as RNTextProps, StyleSheet } from 'react-native';
import { useTheme } from '../../theme/useTheme';
import { typography } from '../../tokens/typography';

export interface TextProps extends RNTextProps {
  variant?: 'h1' | 'h2' | 'h3' | 'body' | 'bodySecondary' | 'caption' | 'label';
  bold?: boolean;
}

export const Text: React.FC<TextProps> = ({
  children,
  variant = 'body',
  bold = false,
  style,
  ...props
}) => {
  const { colors } = useTheme();

  const getStyle = () => {
    switch (variant) {
      case 'h1':
        return {
          fontSize: typography.fontSizes.xxl,
          lineHeight: typography.lineHeights.xxl,
          fontWeight: '700' as const,
          color: colors.text,
        };
      case 'h2':
        return {
          fontSize: typography.fontSizes.xl,
          lineHeight: typography.lineHeights.xl,
          fontWeight: '600' as const,
          color: colors.text,
        };
      case 'h3':
        return {
          fontSize: typography.fontSizes.lg,
          lineHeight: typography.lineHeights.lg,
          fontWeight: '600' as const,
          color: colors.text,
        };
      case 'bodySecondary':
        return {
          fontSize: typography.fontSizes.md,
          lineHeight: typography.lineHeights.md,
          color: colors.textSecondary,
        };
      case 'caption':
        return {
          fontSize: typography.fontSizes.xs,
          lineHeight: typography.lineHeights.xs,
          color: colors.textSecondary,
        };
      case 'label':
        return {
          fontSize: typography.fontSizes.sm,
          lineHeight: typography.lineHeights.sm,
          fontWeight: '500' as const,
          color: colors.text,
        };
      case 'body':
      default:
        return {
          fontSize: typography.fontSizes.md,
          lineHeight: typography.lineHeights.md,
          color: colors.text,
        };
    }
  };

  return (
    <RNText
      style={[
        getStyle(),
        bold && { fontWeight: '700' as const },
        style,
      ]}
      {...props}
    >
      {children}
    </RNText>
  );
};
