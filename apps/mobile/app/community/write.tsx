import React, { useState } from 'react';
import { View, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import {
  ScreenLayout,
  Header,
  Button,
  Chip,
  Text,
  Icon,
} from '@ongo/ui';

const CATEGORIES = ['조리 후기', '나만의 레시피', '질문/답변'];

export default function WritePostScreen() {
  const router = useRouter();
  const [selectedCat, setSelectedCat] = useState('조리 후기');
  const [content, setContent] = useState('');
  const [linkedRecipe, setLinkedRecipe] = useState('🍲 육개장');

  const handleRegister = () => {
    if (!content.trim()) return;
    console.log('Register post:', { selectedCat, content, linkedRecipe });
    router.back();
  };

  return (
    <ScreenLayout>
      <Header
        title="게시글 작성"
        onBack={() => router.back()}
        rightAction={
          <TouchableOpacity onPress={handleRegister} disabled={!content.trim()}>
            <Text variant="label" bold style={{ color: content.trim() ? '#C85A28' : '#D4CFC6' }}>
              등록
            </Text>
          </TouchableOpacity>
        }
      />

      <View style={styles.section}>
        <Text variant="caption" bold style={styles.sectionTitle}>
          카테고리 선택
        </Text>
        <View style={styles.row}>
          {CATEGORIES.map((cat) => (
            <Chip
              key={cat}
              label={cat}
              selected={selectedCat === cat}
              onPress={() => setSelectedCat(cat)}
            />
          ))}
        </View>
      </View>

      {linkedRecipe && (
        <View style={styles.section}>
          <Text variant="caption" bold style={styles.sectionTitle}>
            레시피 태그
          </Text>
          <View style={styles.recipeTag}>
            <Text variant="body" style={{ fontSize: 13 }}>
              {linkedRecipe}
            </Text>
            <TouchableOpacity onPress={() => setLinkedRecipe('')}>
              <Icon name="close" size={14} color="#8C8578" style={{ marginLeft: 8 }} />
            </TouchableOpacity>
          </View>
        </View>
      )}

      <View style={styles.section}>
        <Text variant="caption" bold style={styles.sectionTitle}>
          사진 추가 (최대 3장)
        </Text>
        <View style={styles.row}>
          <TouchableOpacity style={styles.uploadBtn}>
            <Icon name="write" size={20} color="#8C8578" />
            <Text variant="caption" style={{ color: '#8C8578', marginTop: 4 }}>
              추가
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={[styles.section, { flex: 1 }]}>
        <TextInput
          value={content}
          onChangeText={setContent}
          placeholder="오늘 요리한 후기나 요리 팁을 들려주세요! (최대 1000자)"
          placeholderTextColor="#8C8578"
          multiline
          maxLength={1000}
          style={styles.editor}
        />
        <Text variant="caption" style={styles.counter}>
          {content.length}/1000
        </Text>
      </View>
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  section: {
    marginTop: 20,
  },
  sectionTitle: {
    color: '#8C8578',
    marginBottom: 8,
  },
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  recipeTag: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF5F0',
    borderColor: '#FFE4D6',
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
    borderColor: '#D4CFC6',
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
    color: '#8C8578',
    marginBottom: 24,
  },
});
