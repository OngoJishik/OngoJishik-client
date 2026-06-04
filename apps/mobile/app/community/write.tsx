import React, { useState } from 'react';
import { View, StyleSheet, TextInput, Pressable } from 'react-native';
import { useRouter } from 'expo-router';

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

  const handleRegister = () => {
    if (!content.trim()) return;
    if (__DEV__) {
      console.log('Register post:', { selectedCat, content, linkedRecipe });
    }
    router.back();
  };

  const isContentEmpty = !content.trim();

  return (
    <ScreenLayout>
      <Header
        title={t('write.title')}
        onBack={() => router.back()}
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

      {linkedRecipe && (
        <View style={styles.section}>
          <Text variant="caption" bold style={[styles.sectionTitle, { color: colors.textSecondary }]}>
            {t('write.recipeTag')}
          </Text>
          <View style={[styles.recipeTag, { backgroundColor: colors.primaryLight, borderColor: colors.border }]}>
            <Text variant="body" style={{ fontSize: 13, color: colors.text }}>
              {linkedRecipe}
            </Text>
            <Pressable onPress={() => setLinkedRecipe('')}>
              <Icon name="close" size={14} color={colors.textSecondary} style={{ marginLeft: 8 }} />
            </Pressable>
          </View>
        </View>
      )}

      <View style={styles.section}>
        <Text variant="caption" bold style={[styles.sectionTitle, { color: colors.textSecondary }]}>
          {t('write.photoAdd')}
        </Text>
        <View style={styles.row}>
          <Pressable style={[styles.uploadBtn, { borderColor: colors.border }]}>
            <Icon name="write" size={20} color={colors.textSecondary} />
            <Text variant="caption" style={{ color: colors.textSecondary, marginTop: 4 }}>
              {t('write.add')}
            </Text>
          </Pressable>
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

export default WritePostScreen;

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
