import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  TextInput,
  Pressable,
  Modal,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';

import { useTranslation } from '@ongo/i18n';
import { Text, Icon, useTheme } from '@ongo/ui';
import { colors as designColors } from '@ongo/ui';
import { MOCK_FOODS } from '../../../mocks';

export type TLinkedRecipe = { nameKo: string; emoji: string };

export type RecipePickerModalProps = {
  visible: boolean;
  selectedRecipe: TLinkedRecipe | null;
  onClose: () => void;
  onSelect: (recipe: TLinkedRecipe) => void;
};

/**
 * 레시피 선택 모달 — 즐겨찾기 목록 또는 직접 입력으로 레시피를 연결합니다.
 * @author Antigravity
 */
export const RecipePickerModal = ({
  visible,
  selectedRecipe,
  onClose,
  onSelect,
}: RecipePickerModalProps) => {
  const { colors } = useTheme();
  const { t } = useTranslation();
  const [customInput, setCustomInput] = useState('');

  const handleSelectFood = (food: (typeof MOCK_FOODS)[0]) => {
    onSelect({ nameKo: food.nameKo, emoji: food.emoji });
  };

  const handleAddCustom = () => {
    if (!customInput.trim()) return;
    onSelect({ nameKo: customInput.trim(), emoji: '🍽️' });
    setCustomInput('');
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <Pressable style={styles.overlay} onPress={onClose} />
        <View style={[styles.sheet, { backgroundColor: colors.background }]}>
          <View style={[styles.handle, { backgroundColor: colors.border }]} />

          <View style={styles.header}>
            <Text variant="h3" bold style={{ color: colors.text }}>
              {t('write.recipePicker')}
            </Text>
            <Pressable onPress={onClose}>
              <Icon name="close" size={20} color={colors.textSecondary} />
            </Pressable>
          </View>

          <Text variant="caption" bold style={[styles.sectionLabel, { color: colors.textSecondary }]}>
            {t('write.favoriteRecipes')}
          </Text>

          <ScrollView style={styles.list} showsVerticalScrollIndicator={false}>
            {MOCK_FOODS.map((food) => (
              <Pressable
                key={food.id}
                style={[styles.foodItem, { borderBottomColor: colors.border }]}
                onPress={() => handleSelectFood(food)}
              >
                <Text style={styles.emoji}>{food.emoji}</Text>
                <View style={styles.foodInfo}>
                  <Text variant="body" style={{ color: colors.text }}>{food.nameKo}</Text>
                  <Text variant="caption" style={{ color: colors.textTertiary }} numberOfLines={1}>
                    {food.description}
                  </Text>
                </View>
                {selectedRecipe?.nameKo === food.nameKo && (
                  <View style={[styles.selectedDot, { backgroundColor: designColors.primary.DEFAULT }]} />
                )}
              </Pressable>
            ))}
          </ScrollView>

          <View style={[styles.customSection, { borderTopColor: colors.border }]}>
            <Text variant="caption" bold style={[styles.sectionLabel, { color: colors.textSecondary }]}>
              {t('write.customRecipe')}
            </Text>
            <View style={styles.customRow}>
              <TextInput
                value={customInput}
                onChangeText={setCustomInput}
                placeholder={t('write.customRecipePlaceholder')}
                placeholderTextColor={colors.textSecondary}
                style={[
                  styles.customInput,
                  { color: colors.text, borderColor: colors.border, backgroundColor: colors.primaryLight },
                ]}
                returnKeyType="done"
                onSubmitEditing={handleAddCustom}
              />
              <Pressable
                style={[
                  styles.addBtn,
                  { backgroundColor: designColors.primary.DEFAULT, opacity: customInput.trim() ? 1 : 0.4 },
                ]}
                onPress={handleAddCustom}
                disabled={!customInput.trim()}
              >
                <Text variant="label" bold style={{ color: '#FFFFFF' }}>
                  {t('write.add')}
                </Text>
              </Pressable>
            </View>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
  },
  sheet: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 20,
    paddingBottom: Platform.OS === 'ios' ? 34 : 24,
    maxHeight: '65%',
  },
  handle: {
    width: 36,
    height: 4,
    borderRadius: 2,
    alignSelf: 'center',
    marginTop: 12,
    marginBottom: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  sectionLabel: {
    marginBottom: 8,
  },
  list: {
    maxHeight: 220,
  },
  foodItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  emoji: {
    fontSize: 24,
    marginRight: 12,
  },
  foodInfo: {
    flex: 1,
  },
  selectedDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginLeft: 8,
  },
  customSection: {
    borderTopWidth: StyleSheet.hairlineWidth,
    paddingTop: 16,
    marginTop: 8,
  },
  customRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  customInput: {
    flex: 1,
    height: 40,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    fontSize: 14,
  },
  addBtn: {
    height: 40,
    paddingHorizontal: 16,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
