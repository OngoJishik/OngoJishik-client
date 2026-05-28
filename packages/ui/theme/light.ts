import { colors } from '../tokens/colors';

export const lightTheme = {
  dark: false,
  colors: {
    background: colors.neutral[50], // Hanji background
    card: colors.neutral[0],        // White cards
    text: colors.neutral[900],      // Deep black-brown
    textSecondary: colors.neutral[500],
    border: colors.neutral[200],
    primary: colors.primary[500],   // Chili red
    primaryLight: colors.primary[100],
    secondary: colors.secondary[500], // Veggie green
    success: colors.semantic.success,
    error: colors.semantic.error,
    warning: colors.semantic.warning,
    info: colors.semantic.info,
  },
};
export type Theme = typeof lightTheme;
