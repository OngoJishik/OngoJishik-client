import React from 'react';
import { View, Pressable, StyleSheet } from 'react-native';
import { Text } from '../primitives/Text';
import { Icon, IconProps } from '../primitives/Icon';
import { useTheme } from '../../theme/useTheme';
import { spacing } from '../../tokens/spacing';

export interface NavItem {
  key: string;
  label: string;
  iconName: IconProps['name'];
}

interface BottomNavProps {
  items: NavItem[];
  activeKey: string;
  onSelect: (key: string) => void;
}

/**
 * 하단 내비게이션 바 레이아웃 컴포넌트
 * @author Antigravity
 */
export const BottomNav: React.FC<BottomNavProps> = ({ items, activeKey, onSelect }) => {
  const { colors } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: colors.card, borderTopColor: colors.border }]}>
      {items.map((item) => {
        const isActive = item.key === activeKey;
        const color = isActive ? colors.primary : colors.textSecondary;
        return (
          <Pressable
            key={item.key}
            style={({ pressed }) => [
              styles.tab,
              pressed && { opacity: 0.8 },
            ]}
            onPress={() => onSelect(item.key)}
          >
            <Icon name={item.iconName} size={22} color={color} />
            <Text
              variant="caption"
              bold={isActive}
              style={{ color, marginTop: spacing.xs, fontSize: 10 }}
            >
              {item.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 64,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    borderTopWidth: 1,
    paddingBottom: spacing.sm,
  },
  tab: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.xs,
    flex: 1,
  },
});
