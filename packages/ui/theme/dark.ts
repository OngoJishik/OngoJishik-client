import { colors } from '../tokens/colors';
import { Theme } from './light';

export const darkTheme: Theme = {
  dark: true,
  colors: {
    background: colors.neutral[900], // Deep charcoal
    card: colors.neutral[700],        // Muted gray-brown card
    text: colors.neutral[50],         // Hanji paper-white text
    textSecondary: colors.neutral[300],
    border: colors.neutral[500],
    primary: colors.primary[300],     // Softer orange-red
    primaryLight: colors.primary[700],
    secondary: colors.secondary[300], // Soft green
    success: colors.semantic.success,
    error: colors.semantic.error,
    warning: colors.semantic.warning,
    info: colors.semantic.info,
  },
};
