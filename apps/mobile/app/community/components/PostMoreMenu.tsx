import React from 'react';
import { StyleSheet, Pressable, Alert } from 'react-native';

import { useTranslation } from '@ongo/i18n';
import { Text, useTheme, BottomSheet } from '@ongo/ui';

export type PostMoreMenuProps = {
  visible: boolean;
  onClose: () => void;
  onEdit: () => void;
  onDelete: () => void;
};

const CLOSE_ANIM_MS = 260;

/**
 * 게시글 수정/삭제 액션을 제공하는 바텀시트 메뉴 컴포넌트
 * @author Antigravity
 */
export const PostMoreMenu = ({ visible, onClose, onEdit, onDelete }: PostMoreMenuProps) => {
  const { colors } = useTheme();
  const { t } = useTranslation();

  const handleEdit = () => {
    onClose();
    setTimeout(onEdit, CLOSE_ANIM_MS);
  };

  const handleDelete = () => {
    onClose();
    setTimeout(() => {
      Alert.alert(
        t('community.deleteConfirmTitle'),
        t('community.deleteConfirmMessage'),
        [
          { text: t('common.cancel'), style: 'cancel' },
          { text: t('community.deletePost'), style: 'destructive', onPress: onDelete },
        ],
      );
    }, CLOSE_ANIM_MS);
  };

  return (
    <BottomSheet visible={visible} onClose={onClose}>
      <Pressable
        style={[styles.menuItem, { borderBottomColor: colors.border }]}
        onPress={handleEdit}
      >
        <Text variant="body" style={{ color: colors.text }}>
          {t('community.editPost')}
        </Text>
      </Pressable>

      <Pressable
        style={[styles.menuItem, { borderBottomColor: colors.border }]}
        onPress={handleDelete}
      >
        <Text variant="body" style={{ color: '#EF4444' }}>
          {t('community.deletePost')}
        </Text>
      </Pressable>

      <Pressable style={styles.cancelItem} onPress={onClose}>
        <Text variant="body" bold style={{ color: colors.textSecondary }}>
          {t('common.cancel')}
        </Text>
      </Pressable>
    </BottomSheet>
  );
};

const styles = StyleSheet.create({
  menuItem: {
    paddingVertical: 18,
    paddingHorizontal: 24,
    borderBottomWidth: StyleSheet.hairlineWidth,
    alignItems: 'center',
  },
  cancelItem: {
    paddingVertical: 18,
    paddingHorizontal: 24,
    alignItems: 'center',
  },
});
