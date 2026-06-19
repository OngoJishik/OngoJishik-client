import React from 'react';
import { View, TextInput, Pressable } from 'react-native';

import { useTheme } from '../../../theme/useTheme';
import { Icon } from '../../primitives/Icon';
import { Text } from '../../primitives/Text';
import { styles } from './SearchBar.styles';

export type SearchBarProps = {
  value: string;
  onChangeText: (text: string) => void;
  onSearch?: () => void;
  onMicPress?: () => void;
  onClear?: () => void;
  placeholder?: string;
  onFocus?: () => void;
  onBlur?: () => void;
  autoFocus?: boolean;
  showBack?: boolean;
  onBack?: () => void;
  showCancel?: boolean;
  onCancel?: () => void;
};

/**
 * 전통 음식 검색을 위한 텍스트 입력창 컴포넌트
 * @author Antigravity
 */
export const SearchBar = ({
  value,
  onChangeText,
  onSearch,
  onMicPress,
  onClear,
  placeholder = '어떤 전통 음식이 궁금하세요?',
  onFocus,
  onBlur,
  autoFocus,
  showBack,
  onBack,
  showCancel,
  onCancel,
}: SearchBarProps) => {
  const { colors } = useTheme();

  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', marginVertical: 12 }}>
      {showBack && onBack && (
        <Pressable onPress={onBack} style={{ marginRight: 12, padding: 4 }} hitSlop={8}>
          <Icon name="back" size={24} color={colors.text} />
        </Pressable>
      )}
      <View style={[styles.container, { backgroundColor: colors.primaryLight, height: 50, borderRadius: 25, borderWidth: 0, flex: 1, marginVertical: 0 }]}>
        <Icon name="search" size={20} color={colors.textSecondary} style={styles.searchIcon} />
        <TextInput
          value={value}
          onChangeText={onChangeText}
          onSubmitEditing={onSearch}
          placeholder={placeholder}
          placeholderTextColor={colors.textSecondary}
          style={[styles.input, { color: colors.text }]}
          onFocus={onFocus}
          onBlur={onBlur}
          autoFocus={autoFocus}
        />
        {value.length > 0 ? (
          <Pressable onPress={onClear}>
            <Icon name="close" size={16} color={colors.textSecondary} style={styles.actionIcon} />
          </Pressable>
        ) : (
          onMicPress && (
            <Pressable onPress={onMicPress}>
              <Icon name="mic" size={20} color={colors.primary} style={styles.actionIcon} />
            </Pressable>
          )
        )}
      </View>
      {showCancel && onCancel && (
        <Pressable onPress={onCancel} style={{ marginLeft: 12, padding: 4 }} hitSlop={8}>
          <Text variant="body" bold style={{ color: colors.primary }}>
            취소
          </Text>
        </Pressable>
      )}
    </View>
  );
};
