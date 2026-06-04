import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { Text } from '../primitives/Text';
import { Icon, IconProps } from '../primitives/Icon';
import { useTheme } from '../../theme/useTheme';
import { spacing } from '../../tokens/spacing';

interface MenuItemProps {
  label: string;
  iconName: IconProps['name'];
  rightElement?: React.ReactNode;
  onPress: () => void;
}

export const MenuItem: React.FC<MenuItemProps> = ({
  label,
  iconName,
  rightElement,
  onPress,
}) => {
  const { colors } = useTheme();

  return (
    <Pressable
      style={[styles.container, { borderBottomColor: colors.border }]}
      onPress={onPress}
    >
      <View style={styles.leftRow}>
        <Icon name={iconName} size={18} color={colors.primary} style={styles.icon} />
        <Text variant="label" bold>
          {label}
        </Text>
      </View>
      <View style={styles.rightRow}>
        {rightElement}
        <Icon name="chevron-right" size={16} color={colors.textSecondary} style={styles.chevron} />
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.md,
    borderBottomWidth: 1,
  },
  leftRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    marginRight: spacing.md,
  },
  rightRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  chevron: {
    marginLeft: spacing.sm,
  },
});

