import React, { useState } from 'react';
import { View, StyleSheet, TextInput, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { Image } from 'expo-image';

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

const CATEGORIES = [
  { id: 'cookingReview', labelKey: 'community.cookingReview', value: '조리 후기' },
  { id: 'myRecipe', labelKey: 'community.myRecipe', value: '나만의 레시피' },
  { id: 'qna', labelKey: 'community.qna', value: '질문/답변' },
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
  const [selectedCat, setSelectedCat] = useState('조리 후기');
  const [content, setContent] = useState('');
  const [linkedRecipe, setLinkedRecipe] = useState('🍲 육개장');
  const [photos, setPhotos] = useState<string[]>([
    'https://images.unsplash.com/photo-1546069901-ba9599a7e63c',
    'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38',
  ]);

  const handleRegister = () => {
    if (!content.trim()) return;
    if (__DEV__) {
      console.log('Register post:', { selectedCat, content, linkedRecipe, photos });
    }
    router.back();
  };

  const addMockPhoto = () => {
    if (photos.length < 5) {
      setPhotos((prev) => [
        ...prev,
        `https://images.unsplash.com/photo-1546069901-ba9599a7e63c?sig=${Date.now()}`
      ]);
    }
  };

  const removePhoto = (index: number) => {
    setPhotos((prev) => prev.filter((_, i) => i !== index));
  };

  const isContentEmpty = !content.trim();

  return (
    <ScreenLayout>
      <Header
        title={t('write.title')}
        onBack={() => router.back()}
        backIcon="close"
        rightAction={
          <Pressable onPress={handleRegister} disabled={isContentEmpty}>
            <Text
              variant="label"
              bold
              style={{ color: isContentEmpty ? colors.textSecondary : designColors.primary.DEFAULT }}
            >
              {t('write.register')}
            </Text>
          </Pressable>
        }
      />

      <View style={styles.section}>
        <Text variant="caption" bold style={[styles.sectionTitle, { color: colors.textSecondary }]}>
          {t('write.categorySelect')}
        </Text>
        <View style={styles.row}>
          {CATEGORIES.map((cat) => (
            <Chip
              key={cat.id}
              label={t(cat.labelKey)}
              selected={selectedCat === cat.value}
              onPress={() => setSelectedCat(cat.value)}
            />
          ))}
        </View>
      </View>

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
              {linkedRecipe}
            </Text>
            <Pressable onPress={() => setLinkedRecipe('')}>
              <Icon name="close" size={14} color={colors.textSecondary} style={{ marginLeft: 8 }} />
            </Pressable>
          </View>
        ) : null}
      </View>

      <View style={styles.section}>
        <Text variant="caption" bold style={[styles.sectionTitle, { color: colors.textSecondary }]}>
          {t('write.photoAdd')}
        </Text>
        <View style={styles.row}>
          {photos.length < 5 && (
            <Pressable style={[styles.uploadBtn, { borderColor: colors.border }]} onPress={addMockPhoto}>
              <Icon name="write" size={20} color={colors.textSecondary} />
              <Text variant="caption" style={{ color: colors.textSecondary, marginTop: 4 }}>
                {t('write.add')}
              </Text>
            </Pressable>
          )}
          {photos.map((uri, index) => (
            <View key={index} style={[styles.photoContainer, { borderColor: colors.border }]}>
              <Image source={{ uri }} style={styles.photo} contentFit="cover" />
              <Pressable style={styles.photoCloseBtn} onPress={() => removePhoto(index)}>
                <Icon name="close" size={10} color="#FFFFFF" />
              </Pressable>
            </View>
          ))}
        </View>
      </View>

      <View style={[styles.section, { flex: 1 }]}>
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
    </ScreenLayout>
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
  editor: {
    flex: 1,
    fontSize: 14,
    lineHeight: 20,
    textAlignVertical: 'top',
    paddingVertical: 12,
  },
  counter: {
    alignSelf: 'flex-end',
    marginBottom: 24,
  },
});

export { WritePostScreen as default };
