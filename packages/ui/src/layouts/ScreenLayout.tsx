import React from 'react';
import { SafeAreaView, StatusBar, View, ScrollView, ViewStyle, StyleSheet } from 'react-native';
import { useTheme } from '../../theme/useTheme';
import { spacing } from '../../tokens/spacing';

interface ScreenLayoutProps {
  children: React.ReactNode;
  scrollable?: boolean;
  style?: ViewStyle;
  contentContainerStyle?: ViewStyle;
}

export const ScreenLayout: React.FC<ScreenLayoutProps> = ({
  children,
  scrollable = false,
  style,
  contentContainerStyle,
}) => {
  const { colors, isDarkMode } = useTheme();

  const containerStyle = [
    styles.container,
    { backgroundColor: colors.background },
    style,
  ];

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} backgroundColor={colors.background} />
      {scrollable ? (
        <ScrollView
          style={containerStyle}
          contentContainerStyle={[styles.scrollContent, contentContainerStyle]}
          showsVerticalScrollIndicator={false}
        >
          {children}
        </ScrollView>
      ) : (
        <View style={containerStyle}>{children}</View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: spacing.lg,
  },
  scrollContent: {
    paddingBottom: spacing.xxxl,
  },
});
