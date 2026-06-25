import React from 'react';
import { StatusBar, View, ScrollView, ViewStyle, StyleSheet } from 'react-native';
import { SafeAreaView, Edge } from 'react-native-safe-area-context';

import { useTheme } from '../../theme/useTheme';
import { spacing } from '../../tokens/spacing';

interface ScreenLayoutProps {
  children: React.ReactNode;
  scrollable?: boolean;
  scrollEnabled?: boolean;
  style?: ViewStyle;
  contentContainerStyle?: ViewStyle;
  edges?: Edge[];
}

/**
 * 안전 영역(SafeArea)과 스크롤 동작을 관리하는 모바일 화면용 기본 레이아웃 컴포넌트
 * @param props ScreenLayoutProps
 * @author Antigravity
 */
export const ScreenLayout: React.FC<ScreenLayoutProps> = ({
  children,
  scrollable = false,
  scrollEnabled = true,
  style,
  contentContainerStyle,
  edges = ['top', 'left', 'right', 'bottom'],
}) => {
  const { colors, isDarkMode } = useTheme();

  const containerStyle = [
    styles.container,
    { backgroundColor: colors.background },
    style,
  ];

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }} edges={edges}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} backgroundColor={colors.background} />
      {scrollable ? (
        <ScrollView
          style={containerStyle}
          contentContainerStyle={[styles.scrollContent, contentContainerStyle]}
          showsVerticalScrollIndicator={false}
          scrollEnabled={scrollEnabled}
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
