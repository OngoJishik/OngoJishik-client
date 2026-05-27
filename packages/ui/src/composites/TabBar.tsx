import React from 'react';
import { View, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { Text } from '../primitives/Text';
import { useTheme } from '../../theme/useTheme';
import { spacing } from '../../tokens/spacing';

interface TabBarProps {
  tabs: string[];
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export const TabBar: React.FC<TabBarProps> = ({ tabs, activeTab, onTabChange }) => {
  const { colors } = useTheme();

  return (
    <View style={[styles.container, { borderBottomColor: colors.border }]}>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {tabs.map((tab) => {
          const isActive = tab === activeTab;
          return (
            <TouchableOpacity
              key={tab}
              onPress={() => onTabChange(tab)}
              style={[
                styles.tab,
                isActive && { borderBottomColor: colors.primary },
              ]}
              activeOpacity={0.8}
            >
              <Text
                variant="label"
                bold={isActive}
                style={{ color: isActive ? colors.primary : colors.textSecondary }}
              >
                {tab}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderBottomWidth: 1,
    width: '100%',
  },
  scrollContent: {
    paddingHorizontal: spacing.md,
  },
  tab: {
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
});
