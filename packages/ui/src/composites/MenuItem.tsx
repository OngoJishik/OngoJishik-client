import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { Text } from '../primitives/Text';
import { Icon, IconProps, TIconName } from '../primitives/Icon';
import { useTheme } from '../../theme/useTheme';
import { spacing } from '../../tokens/spacing';

interface MenuItemProps {
  icon: string;
  iconName?: TIconName;
  title: string;
  description: string;
  rightElement?: React.ReactNode;
  onPress: () => void;
}

export const MenuItem: React.FC<MenuItemProps> = ({
  icon,
  iconName,
  title,
  description,
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
        <View style={[styles.iconContainer, { backgroundColor: colors.primaryLight }]}>
          {iconName
            ? <Icon name={iconName} size={18} color={colors.primary} />
            : <Text style={styles.iconText}>{icon}</Text>
          }
        </View>
        <View style={styles.textContainer}>
          <Text variant="label" bold style={{ color: colors.text }}>
            {title}
          </Text>
          <Text variant="caption" style={{ color: colors.textSecondary, marginTop: 2 }}>
            {description}
          </Text>
        </View>
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
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
  },
  iconText: {
    fontSize: 18,
  },
  textContainer: {
    flexDirection: 'column',
  },
  rightRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  chevron: {
    marginLeft: spacing.sm,
  },
});

