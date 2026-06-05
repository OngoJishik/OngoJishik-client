import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';

import { useTranslation } from '@ongo/i18n';
import { ScreenLayout, Button, Text, useTheme } from '@ongo/ui';

/**
 * 로그인 화면 컴포넌트 (Google OAuth 플레이스홀더)
 * @author Antigravity
 */
export const LoginScreen = () => {
  const router = useRouter();
  const { colors } = useTheme();
  const { t } = useTranslation();

  const handleGoogleLogin = () => {
    if (__DEV__) {
      console.log('Google login process started...');
    }
    // Simulate successful login and go back or to home
    router.replace('/(tabs)');
  };

  return (
    <ScreenLayout style={styles.container}>
      <View style={styles.content}>
        <Text variant="h1" bold style={[styles.title, { color: colors.text }]}>
          🍚 {t('auth.loginTitle', { defaultValue: '온고지식 로그인' })}
        </Text>
        <Text variant="body" style={[styles.description, { color: colors.textSecondary }]}>
          {t('auth.loginDesc', { defaultValue: '한국 전통 음식 추천 및 역사 탐색 서비스' })}
        </Text>
        <Button
          title={t('auth.googleLogin', { defaultValue: 'Google로 로그인' })}
          onPress={handleGoogleLogin}
          style={styles.loginBtn}
        />
      </View>
    </ScreenLayout>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    width: '100%',
    paddingHorizontal: 24,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    marginBottom: 12,
    textAlign: 'center',
  },
  description: {
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 32,
  },
  loginBtn: {
    width: '100%',
  },
});

export { LoginScreen as default };
