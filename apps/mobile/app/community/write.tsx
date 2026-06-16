import React, { useState, useEffect } from 'react';
import { View, StyleSheet, TextInput, Pressable, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Image } from 'expo-image';
import * as ImagePicker from 'expo-image-picker';

import { useTranslation } from '@ongo/i18n';
import {
  ScreenLayout,
  Header,
  Chip,
  Text,
  Icon,
  useTheme,
} from '@ongo/ui';
import { colors as designColors } from '@ongo/ui';
import {
  useBoardDetailQuery,
  useCreateBoardMutation,
  useUpdateBoardMutation,
  useUploadImagesMutation,
} from '@ongo/api-client';
import type { TImageFile } from '@ongo/api-client';

import { RecipePickerModal } from './components/RecipePickerModal';
import type { TLinkedRecipe } from './components/RecipePickerModal';
import type { TBoardCategory } from '@ongo/api-client';

const CATEGORIES: { id: TBoardCategory; labelKey: string }[] = [
  { id: 'REVIEW', labelKey: 'community.cookingReview' },
  { id: 'RECIPE', labelKey: 'community.myRecipe' },
  { id: 'QNA', labelKey: 'community.qna' },
];

/**
 * 커뮤니티 게시글 작성 화면 컴포넌트
 * 카테고리 선택, 레시피 연계 태그 설정, 본문 작성 기능을 제공합니다.
 * @author Antigravity
 */
export const WritePostScreen = () => {
  const router = useRouter();
  const { colors } = useTheme();
  const { t } = useTranslation();
  const {
    postId,
    mode,
    initCategory,
    initContent,
    initTitle,
    initLinkedRecipeNameKo,
    initLinkedRecipeEmoji,
    initImages,
  } = useLocalSearchParams<{
    postId?: string;
    mode?: string;
    initCategory?: string;
    initContent?: string;
    initTitle?: string;
    initLinkedRecipeNameKo?: string;
    initLinkedRecipeEmoji?: string;
    initImages?: string;
  }>();
  const isEditMode = mode === 'edit' && !!postId;
  const boardId = isEditMode ? parseInt(postId ?? '', 10) : 0;

  const [selectedCat, setSelectedCat] = useState<TBoardCategory>(() =>
    isEditMode && initCategory ? (String(initCategory) as TBoardCategory) : 'REVIEW',
  );
  const [title, setTitle] = useState<string>(() =>
    isEditMode && initTitle ? String(initTitle) : '',
  );
  const [content, setContent] = useState<string>(() =>
    isEditMode && initContent ? String(initContent) : '',
  );
  const [linkedRecipe, setLinkedRecipe] = useState<TLinkedRecipe | null>(() => {
    if (isEditMode && initLinkedRecipeNameKo && initLinkedRecipeEmoji) {
      return { nameKo: String(initLinkedRecipeNameKo), emoji: String(initLinkedRecipeEmoji) };
    }
    return null;
  });
  const [photos, setPhotos] = useState<string[]>(() => {
    if (isEditMode && initImages) {
      try { return JSON.parse(String(initImages)); } catch {}
    }
    return [];
  });
  const [isRecipeModalOpen, setIsRecipeModalOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const { data: existingPost } = useBoardDetailQuery(boardId);
  const { mutate: createBoard } = useCreateBoardMutation();
  const { mutate: updateBoard } = useUpdateBoardMutation();
  const { mutateAsync: uploadImagesMutate } = useUploadImagesMutation();

  useEffect(() => {
    if (isEditMode && existingPost) {
      setSelectedCat(existingPost.category);
      setTitle(existingPost.title);
      setContent(existingPost.content);
      setPhotos(existingPost.imageUrls ?? []);
    }
  }, [isEditMode, existingPost]);

  const handleRegister = async () => {
    if (!title.trim() || !content.trim()) return;

    setIsUploading(true);
    try {
      const localPhotos = photos.filter((uri) => !uri.startsWith('http'));
      const existingUrls = photos.filter((uri) => uri.startsWith('http'));

      let newUrls: string[] = [];
      if (localPhotos.length > 0) {
        const imageFiles: TImageFile[] = localPhotos.map((uri, i) => ({
          uri,
          name: `photo_${Date.now()}_${i}.jpg`,
          type: 'image/jpeg',
        }));
        const uploadResult = await uploadImagesMutate(imageFiles);
        newUrls = uploadResult.imageUrls;
      }

      const payload = {
        title: title.trim(),
        content: content.trim(),
        imageUrls: [...existingUrls, ...newUrls],
        category: selectedCat,
      };

      if (isEditMode && boardId) {
        updateBoard(
          { boardId, data: payload },
          { onSuccess: () => router.back() },
        );
        return;
      }
      createBoard(payload, { onSuccess: () => router.back() });
    } catch {
      // 업로드 실패 시 화면에 머물러 재시도 가능
    } finally {
      setIsUploading(false);
    }
  };

  const handleAddPhoto = async () => {
    if (photos.length >= 5) return;
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: false,
      quality: 0.8,
    });
    if (!result.canceled && result.assets.length > 0) {
      setPhotos((prev) => [...prev, result.assets[0].uri]);
    }
  };

  const removePhoto = (uri: string) => {
    setPhotos((prev) => prev.filter((p) => p !== uri));
  };

  const isFormInvalid = !title.trim() || !content.trim();

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={{ flex: 1 }}
    >
      <ScreenLayout>
        <Header
          title={isEditMode ? t('write.editTitle') : t('write.title')}
          onBack={() => router.back()}
          backIcon="close"
          rightAction={
            <Pressable onPress={handleRegister} disabled={isFormInvalid || isUploading}>
              <Text
                variant="label"
                bold
                style={{ color: (isFormInvalid || isUploading) ? colors.textSecondary : designColors.primary.DEFAULT }}
              >
                {isUploading ? t('write.uploading') : (isEditMode ? t('write.edit') : t('write.register'))}
              </Text>
            </Pressable>
          }
        />

        <ScrollView
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={styles.scrollContainer}
        >
          {/* 카테고리 선택 */}
          <View style={styles.section}>
            <Text variant="caption" bold style={[styles.sectionTitle, { color: colors.textSecondary }]}>
              {t('write.categorySelect')}
            </Text>
            <View style={styles.row}>
              {CATEGORIES.map((cat) => (
                <Chip
                  key={cat.id}
                  label={t(cat.labelKey)}
                  selected={selectedCat === cat.id}
                  onPress={() => setSelectedCat(cat.id)}
                />
              ))}
            </View>
          </View>

          {/* 레시피 태그 */}
          <View style={styles.section}>
            <Text variant="caption" bold style={[styles.sectionTitle, { color: colors.textSecondary }]}>
              {t('write.recipeTag')}
            </Text>
            <Text variant="caption" style={{ color: colors.textTertiary, marginBottom: 8 }}>
              {t('write.recipeTagGuide')}
            </Text>
            {linkedRecipe ? (
              <View style={[styles.recipeTag, { backgroundColor: colors.primaryLight, borderColor: colors.border }]}>
                <Text variant="body" style={{ fontSize: 13, color: colors.text }}>
                  {linkedRecipe.emoji} {linkedRecipe.nameKo}
                </Text>
                <Pressable onPress={() => setLinkedRecipe(null)}>
                  <Icon name="close" size={14} color={colors.textSecondary} style={{ marginLeft: 8 }} />
                </Pressable>
              </View>
            ) : (
              <Pressable
                style={[styles.addRecipeBtn, { borderColor: colors.border }]}
                onPress={() => setIsRecipeModalOpen(true)}
              >
                <Icon name="write" size={14} color={colors.textSecondary} />
                <Text variant="caption" style={{ color: colors.textSecondary, marginLeft: 6 }}>
                  {t('write.addRecipeTag')}
                </Text>
              </Pressable>
            )}
          </View>

          {/* 사진 추가 */}
          <View style={styles.section}>
            <Text variant="caption" bold style={[styles.sectionTitle, { color: colors.textSecondary }]}>
              {t('write.photoAdd')}
            </Text>
            <View style={styles.row}>
              {photos.length < 5 && (
                <Pressable style={[styles.uploadBtn, { borderColor: colors.border }]} onPress={handleAddPhoto}>
                  <Icon name="write" size={20} color={colors.textSecondary} />
                  <Text variant="caption" style={{ color: colors.textSecondary, marginTop: 4 }}>
                    {t('write.add')}
                  </Text>
                </Pressable>
              )}
              {photos.map((uri) => (
                <View key={uri} style={[styles.photoContainer, { borderColor: colors.border }]}>
                  <Image source={{ uri }} style={styles.photo} contentFit="cover" />
                  <Pressable style={styles.photoCloseBtn} onPress={() => removePhoto(uri)}>
                    <Icon name="close" size={10} color="#FFFFFF" />
                  </Pressable>
                </View>
              ))}
            </View>
          </View>

          {/* 글 작성 — 카드 섹션 */}
          <View style={[styles.editorCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <TextInput
              value={title}
              onChangeText={setTitle}
              placeholder={t('write.titlePlaceholder')}
              placeholderTextColor={colors.textSecondary}
              style={[styles.titleInput, { color: colors.text, borderBottomColor: colors.border }]}
              maxLength={100}
            />
            <TextInput
              value={content}
              onChangeText={setContent}
              placeholder={t('write.placeholder')}
              placeholderTextColor={colors.textSecondary}
              multiline
              maxLength={1000}
              style={[styles.editor, { color: colors.text }]}
            />
            <Text variant="caption" style={[styles.counter, { color: colors.textSecondary }]}>
              {content.length}/1000
            </Text>
          </View>
        </ScrollView>

        <RecipePickerModal
          visible={isRecipeModalOpen}
          selectedRecipe={linkedRecipe}
          onClose={() => setIsRecipeModalOpen(false)}
          onSelect={(recipe) => {
            setLinkedRecipe(recipe);
            setIsRecipeModalOpen(false);
          }}
        />
      </ScreenLayout>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  section: {
    marginTop: 20,
  },
  sectionTitle: {
    marginBottom: 8,
  },
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  recipeTag: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  addRecipeBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderStyle: 'dashed',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    alignSelf: 'flex-start',
  },
  uploadBtn: {
    width: 64,
    height: 64,
    borderRadius: 8,
    borderWidth: 1,
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
    marginBottom: 8,
  },
  photoContainer: {
    width: 64,
    height: 64,
    borderRadius: 8,
    borderWidth: 1,
    position: 'relative',
    marginRight: 8,
    marginBottom: 8,
  },
  photo: {
    width: '100%',
    height: '100%',
    borderRadius: 7,
  },
  photoCloseBtn: {
    position: 'absolute',
    top: -4,
    right: -4,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollContainer: {
    paddingBottom: 40,
  },
  editorCard: {
    minHeight: 250,
    marginTop: 20,
    borderWidth: 1,
    borderRadius: 12,
    padding: 16,
  },
  titleInput: {
    fontSize: 16,
    fontWeight: 'bold',
    paddingVertical: 8,
    borderBottomWidth: StyleSheet.hairlineWidth,
    marginBottom: 8,
  },
  editor: {
    flex: 1,
    fontSize: 14,
    lineHeight: 20,
    textAlignVertical: 'top',
    paddingVertical: 8,
  },
  counter: {
    alignSelf: 'flex-end',
    marginTop: 4,
  },
});

export { WritePostScreen as default };
