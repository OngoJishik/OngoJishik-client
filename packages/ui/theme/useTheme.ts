import { useThemeContext } from './ThemeProvider';

export function useTheme() {
  const { theme, isDarkMode, toggleTheme } = useThemeContext();
  return {
    theme,
    colors: theme.colors,
    isDarkMode,
    toggleTheme,
  };
}
