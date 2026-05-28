import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import {
  ScreenLayout,
  Header,
  Text,
  Icon,
} from '@ongo/ui';

const LANGUAGES = [
  { key: 'ko', label: '한국어 (Korean)' },
  { key: 'en', label: 'English (영어)' },
  { key: 'ja', label: '日本語 (Japanese)' },
  { key: 'zh', label: '简体中文 (Chinese Simplified)' },
];

export default function LanguageSettingsScreen() {
  const router = useRouter();
  const [selectedLang, setSelectedLang] = useState('ko');

  return (
    <ScreenLayout>
      <Header title="언어 설정" onBack={() => router.back()} />

      <View style={styles.list}>
        {LANGUAGES.map((lang) => {
          const isSelected = selectedLang === lang.key;
          return (
            <TouchableOpacity
              key={lang.key}
              style={[
                styles.item,
                isSelected && styles.activeItem,
              ]}
              onPress={() => setSelectedLang(lang.key)}
            >
              <Text variant="label" bold={isSelected}>
                {lang.label}
              </Text>
              {isSelected && <Icon name="star" size={16} color="#C85A28" />}
            </TouchableOpacity>
          );
        })}
      </View>
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  list: {
    marginTop: 24,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E8E4DD',
  },
  activeItem: {
    borderBottomColor: '#C85A28',
  },
});
