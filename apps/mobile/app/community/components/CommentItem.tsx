import React, { useState, useRef } from 'react';
import { View, StyleSheet, Alert, Pressable, TextInput } from 'react-native';

import { useTranslation } from '@ongo/i18n';
import { Avatar, Text, useTheme, BottomSheet } from '@ongo/ui';
import { formatDate } from '@ongo/utils';

export type TCommentAuthor = {
  id: string;
  name: string;
  avatarUrl?: string;
};

export type TCommentData = {
  id: string;
  author: TCommentAuthor;
  content: string;
  createdAt: string;
};

export type CommentItemProps = {
  comment: TCommentData;
  isAuthor: boolean;
  onUpdate: (commentId: string, content: string) => void;
  onDelete: (commentId: string) => void;
  onEditingChange?: (isEditing: boolean) => void;
  onEditStart?: () => void;
};

// BottomSheet(Modal) 닫힌 애니메이션(250ms) + Modal 언마운트 대기 + 여유
const CLOSE_ANIM_MS = 420;

/**
 * 커뮤니티 댓글 아이템 컴포넌트
 * 본인 댓글에만 ⋯ 메뉴(수정/삭제)를 표시하고, 수정 시 인라인 TextInput으로 전환됩니다.
 * @author Antigravity
 */
export const CommentItem = ({ comment, isAuthor, onUpdate, onDelete, onEditingChange, onEditStart }: CommentItemProps) => {
  const { colors } = useTheme();
  const { t } = useTranslation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(comment.content);
  const inputRef = useRef<TextInput>(null);
  const pendingEdit = useRef(false); // 수정 전환 종류 플래그

  const handleEdit = () => {
    // BottomSheet를 닫고, onClosed 콜백에서 편집 모드 전환
    pendingEdit.current = true;
    setIsMenuOpen(false);
  };

  const handleEditAfterClose = () => {
    if (!pendingEdit.current) return;
    pendingEdit.current = false;
    setEditText(comment.content);
    setIsEditing(true);
    onEditingChange?.(true);
    // 편집 진입을 부모에 알려 해당 댓글을 키보드 위로 스크롤하도록 함
    onEditStart?.();
    // Modal이 언마운트된 다음 프레임에 키보드 요청 (네이티브 Modal 완전 해제를 위해 200ms 대기)
    setTimeout(() => {
      inputRef.current?.focus();
    }, 200);
  };

  const handleDelete = () => {
    setIsMenuOpen(false);
    setTimeout(() => {
      Alert.alert(
        t('comment.deleteCommentConfirmTitle'),
        t('comment.deleteCommentConfirmMessage'),
        [
          { text: t('common.cancel'), style: 'cancel' },
          { text: t('comment.deleteComment'), style: 'destructive', onPress: () => onDelete(comment.id) },
        ],
      );
    }, CLOSE_ANIM_MS);
  };

  const handleSave = () => {
    if (editText.trim()) {
      onUpdate(comment.id, editText.trim());
    }
    setIsEditing(false);
    onEditingChange?.(false);
  };

  const handleCancel = () => {
    setEditText(comment.content);
    setIsEditing(false);
    onEditingChange?.(false);
  };

  return (
    <View style={styles.row}>
      <Avatar name={comment.author.name} size={30} />
      <View style={styles.meta}>
        <View style={styles.headerRow}>
          <Text variant="label" bold style={styles.authorName}>
            {comment.author.name}
          </Text>
          <View style={styles.headerRight}>
            <Text variant="caption" style={styles.time}>
              {formatDate(comment.createdAt)}
            </Text>
            {isAuthor && !isEditing && (
              <Pressable onPress={() => setIsMenuOpen(true)} hitSlop={8} style={styles.moreBtn}>
                <Text variant="caption" style={{ color: colors.textSecondary, fontSize: 16 }}>⋯</Text>
              </Pressable>
            )}
          </View>
        </View>

        {isEditing ? (
          <View>
            <TextInput
              ref={inputRef}
              value={editText}
              onChangeText={setEditText}
              multiline
              style={[styles.editInput, { color: colors.text, borderColor: colors.border, backgroundColor: colors.card }]}
            />
            <View style={styles.editActions}>
              <Pressable onPress={handleCancel} style={styles.editBtn}>
                <Text variant="caption" style={{ color: colors.textSecondary }}>
                  {t('comment.cancelEdit')}
                </Text>
              </Pressable>
              <Pressable onPress={handleSave} style={styles.editBtn} disabled={!editText.trim()}>
                <Text variant="caption" bold style={{ color: editText.trim() ? colors.primary : colors.textSecondary }}>
                  {t('comment.save')}
                </Text>
              </Pressable>
            </View>
          </View>
        ) : (
          <Text variant="body" style={styles.content}>
            {comment.content}
          </Text>
        )}
      </View>

      <BottomSheet
        visible={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
        onClosed={handleEditAfterClose}
      >
        <Pressable
          style={[styles.menuItem, { borderBottomColor: colors.border }]}
          onPress={handleEdit}
        >
          <Text variant="body" style={{ color: colors.text }}>
            {t('comment.editComment')}
          </Text>
        </Pressable>

        <Pressable
          style={[styles.menuItem, { borderBottomColor: colors.border }]}
          onPress={handleDelete}
        >
          <Text variant="body" style={{ color: '#EF4444' }}>
            {t('comment.deleteComment')}
          </Text>
        </Pressable>

        <Pressable style={styles.cancelItem} onPress={() => setIsMenuOpen(false)}>
          <Text variant="body" bold style={{ color: colors.textSecondary }}>
            {t('common.cancel')}
          </Text>
        </Pressable>
      </BottomSheet>
    </View>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
    paddingHorizontal: 4,
  },
  meta: {
    flex: 1,
    marginLeft: 12,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  authorName: {
    fontSize: 13,
  },
  time: {
    fontSize: 10,
  },
  moreBtn: {
    paddingHorizontal: 4,
  },
  content: {
    fontSize: 13,
    lineHeight: 18,
    marginTop: 4,
  },
  editInput: {
    marginTop: 6,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 6,
    fontSize: 13,
    lineHeight: 18,
    minHeight: 60,
    textAlignVertical: 'top',
  },
  editActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 16,
    marginTop: 6,
  },
  editBtn: {
    paddingVertical: 4,
  },
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
