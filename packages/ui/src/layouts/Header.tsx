import React from 'react';
import { View, Pressable, StyleSheet } from 'react-native';
import { Text } from '../primitives/Text';
import { Icon } from '../primitives/Icon';
import { useTheme } from '../../theme/useTheme';
import { spacing } from '../../tokens/spacing';

interface HeaderProps {
  title: string;
  onBack?: () => void;
  backIcon?: 'back' | 'close';
  rightAction?: React.ReactNode;
}

/**
 * 앱의 최상단에서 제목과 네비게이션 액션을 제어하는 헤더 레이아웃 컴포넌트
 * @author Antigravity
 */
export const Header: React.FC<HeaderProps> = ({ title, onBack, backIcon = 'back', rightAction }) => {
  const { colors } = useTheme();

  return (
    <View style={[styles.container, { borderBottomColor: colors.border }]}>
      <View style={styles.left}>
        {onBack && (
          <Pressable
            onPress={onBack}
            style={({ pressed }) => [
              styles.backBtn,
              pressed && { opacity: 0.7 },
            ]}
          >
            <Icon name={backIcon} size={22} color={colors.text} />
          </Pressable>
        )}
        <Text variant="h2" bold numberOfLines={1}>
          {title}
        </Text>
      </View>
      <View style={styles.right}>{rightAction}</View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.sm,
    borderBottomWidth: 1,
  },
  left: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  backBtn: {
    marginRight: spacing.sm,
    padding: spacing.xs,
  },
  right: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});
