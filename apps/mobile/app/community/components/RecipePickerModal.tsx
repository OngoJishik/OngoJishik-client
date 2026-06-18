import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  TextInput,
  Pressable,
  ScrollView,
  ActivityIndicator,
} from 'react-native';

import { useTranslation } from '@ongo/i18n';
import { Text, Icon, useTheme, BottomSheet } from '@ongo/ui';
import { colors as designColors } from '@ongo/ui';
import { useBookmarkedRecipesQuery } from '@ongo/api-client';

/**
 * 레시피 선택 모달에서 사용하는 연결 레시피 타입
 * recipeId가 있으면 북마크 기반(음식 상세 이동 가능), 없으면 수동 입력
 * @author Antigravity
 */
export type TLinkedRecipe = { nameKo: string; emoji: string; recipeId?: string };

export type RecipePickerModalProps = {
  visible: boolean;
  selectedRecipe: TLinkedRecipe | null;
  onClose: () => void;
  onSelect: (recipe: TLinkedRecipe) => void;
};

/**
 * 레시피 선택 모달 — 즐겨찾기 음식 레시피 목록(GET /api/bookmarks/recipes) 또는 직접 입력으로 레시피를 연결합니다.
 * 즐겨찾기 레시피를 선택하면 recipeId가 포함되어 게시글 작성 API로 전달됩니다.
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

  const { data: bookmarkedRecipes, isLoading } = useBookmarkedRecipesQuery();

  const handleSelectBookmarked = (recipeId: string, foodName: string) => {
    onSelect({ nameKo: foodName, emoji: '🍲', recipeId });
  };

  const handleAddCustom = () => {
    if (!customInput.trim()) return;
    // 수동 입력은 recipeId 없이 전달 (음식 상세 이동 불가)
    onSelect({ nameKo: customInput.trim(), emoji: '🍽️' });
    setCustomInput('');
  };

  const renderRecipeList = () => {
    if (isLoading) {
      return (
        <View style={styles.emptyContainer}>
          <ActivityIndicator size="small" color={designColors.primary.DEFAULT} />
        </View>
      );
    }

    if (!bookmarkedRecipes || bookmarkedRecipes.length === 0) {
      return (
        <View style={styles.emptyContainer}>
          <Text variant="caption" style={{ color: colors.textTertiary, textAlign: 'center' }}>
            {t('write.noFavoriteRecipes')}
          </Text>
        </View>
      );
    }

    return bookmarkedRecipes.map((item) => (
      <Pressable
        key={item.recipeId}
        style={[styles.foodItem, { borderBottomColor: colors.border }]}
        onPress={() => handleSelectBookmarked(item.recipeId, item.foodName)}
      >
        <Text style={styles.emoji}>🍲</Text>
        <View style={styles.foodInfo}>
          <Text variant="body" style={{ color: colors.text }}>{item.foodName}</Text>
          <Text variant="caption" style={{ color: colors.textTertiary }} numberOfLines={1}>
            {item.recipe}
          </Text>
        </View>
        {selectedRecipe?.recipeId === item.recipeId && (
          <View style={[styles.selectedDot, { backgroundColor: designColors.primary.DEFAULT }]} />
        )}
      </Pressable>
    ));
  };

  return (
    <BottomSheet visible={visible} onClose={onClose} maxHeight="65%">
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
        {renderRecipeList()}
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
    </BottomSheet>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  sectionLabel: {
    marginBottom: 8,
    paddingHorizontal: 20,
  },
  list: {
    maxHeight: 220,
    paddingHorizontal: 20,
  },
  emptyContainer: {
    paddingVertical: 24,
    alignItems: 'center',
    justifyContent: 'center',
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
    paddingHorizontal: 20,
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
