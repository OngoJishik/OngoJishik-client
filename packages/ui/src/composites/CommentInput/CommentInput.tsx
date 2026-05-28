import React from 'react';
import { View, TextInput, Pressable } from 'react-native';

import { useTheme } from '../../../theme/useTheme';
import { Icon } from '../../primitives/Icon';
import { styles } from './CommentInput.styles';
import { colors as designColors } from '../../../tokens/colors';

export type CommentInputProps = {
  value: string;
  onChangeText: (text: string) => void;
  onSubmit: () => void;
  placeholder?: string;
};

/**
 * 게시글 또는 상세 콘텐츠 아래에 댓글을 달 수 있도록 디자인된 입력창 컴포넌트
 * @author Antigravity
 */
export const CommentInput = ({
  value,
  onChangeText,
  onSubmit,
  placeholder = '댓글을 입력하세요...',
}: CommentInputProps) => {
  const { colors } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: colors.card, borderTopColor: colors.border }]}>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={colors.textSecondary}
        style={[styles.input, { color: colors.text, backgroundColor: designColors.neutral[100] }]}
      />
      <Pressable
        style={[styles.sendBtn, { backgroundColor: value.trim() ? colors.primary : colors.border }]}
        disabled={!value.trim()}
        onPress={onSubmit}
      >
        <Icon name="chevron-right" size={16} color={colors.background} />
      </Pressable>
    </View>
  );
};
