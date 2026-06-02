import React from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { useAtom } from 'jotai';

import { useTranslation } from '@ongo/i18n';
import { languageAtom } from '@ongo/store';
import {
  ScreenLayout,
  Header,
  Text,
  Icon,
  useTheme,
} from '@ongo/ui';

import type { TLanguage } from '@ongo/store';

const LANGUAGES = [
  { key: 'ko', translationKey: 'korean' },
  { key: 'en', translationKey: 'english' },
  { key: 'ja', translationKey: 'japanese' },
  { key: 'zh', translationKey: 'chinese' },
] as const;

/**
 * 다국어 언어 설정을 변경하는 화면 컴포넌트
 * @author Antigravity
 */
export const LanguageSettingsScreen = () => {
  const router = useRouter();
  const { colors } = useTheme();
  const { t } = useTranslation();
  const [currentLang, setCurrentLang] = useAtom(languageAtom);

  const handleLanguageSelect = (langKey: TLanguage) => {
    setCurrentLang(langKey);
  };

  return (
    <ScreenLayout>
      <Header title={t('settings.languageTitle')} onBack={() => router.back()} />

      <View style={styles.list}>
        {LANGUAGES.map((lang) => {
          const isSelected = currentLang === lang.key;
          return (
            <Pressable
              key={lang.key}
              style={[
                styles.item,
                { borderBottomColor: colors.border },
                isSelected && { borderBottomColor: colors.primary },
              ]}
              onPress={() => handleLanguageSelect(lang.key)}
            >
              <Text variant="label" bold={isSelected}>
                {t(`settings.${lang.translationKey}`)}
              </Text>
              {isSelected && <Icon name="star" size={16} color={colors.primary} />}
            </Pressable>
          );
        })}
      </View>
    </ScreenLayout>
  );
};

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
  },
});

export default LanguageSettingsScreen;

