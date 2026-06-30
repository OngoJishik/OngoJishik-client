import React from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { Image } from 'expo-image';
import { useSetAtom } from 'jotai';

import { useTranslation } from '@ongo/i18n';
import { ScreenLayout, Button, Text, useTheme } from '@ongo/ui';
import { useGoogleLoginMutation } from '@ongo/api-client';
import { authTokenAtom, refreshTokenAtom, userProfileAtom } from '@ongo/store';

/**
 * 로그인 화면 컴포넌트 (구글 소셜 로그인 연동)
 * @author Antigravity
 */
export const LoginScreen = () => {
  const { colors } = useTheme();
  const { t } = useTranslation();
  const router = useRouter();

  const { mutateAsync: loginWithGoogle, isPending } = useGoogleLoginMutation();
  const setAuthToken = useSetAtom(authTokenAtom);
  const setRefreshToken = useSetAtom(refreshTokenAtom);
  const setUserProfile = useSetAtom(userProfileAtom);

  const handleGoogleLogin = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      const response = await GoogleSignin.signIn();
      
      const idToken = response.data?.idToken;
      if (!idToken) {
        throw new Error('Google Sign-in did not return an ID token.');
      }

      // Call backend API with the Google ID Token
      const result = await loginWithGoogle(idToken);

      // Map backend response to TUserProfile format
      const userProfile = {
        id: String(result.userId),
        email: result.email,
        name: result.nickname,
        language: 'ko' as const,
        notificationsEnabled: true,
      };

      // Update Jotai atoms (automatically saved to AsyncStorage)
      setAuthToken(result.accessToken);
      setRefreshToken(result.refreshToken);
      setUserProfile(userProfile);

      router.replace('/(tabs)');
    } catch (error) {
      if (__DEV__) {
        console.error('Google login failed:', error);
      }
      
      Alert.alert(
        t('common.error', { defaultValue: '오류' }),
        t('common.loginFailed', { defaultValue: '로그인에 실패했습니다. 다시 시도해주세요.' })
      );
    }
  };

  return (
    <ScreenLayout style={styles.container}>
      <View style={styles.content}>
        <Image
          source={require('../../assets/icons/icon.png')}
          style={styles.logo}
          contentFit="contain"
        />
        <Text variant="h1" bold style={[styles.title, { color: colors.text }]}>
          {t('auth.loginTitle', { defaultValue: '온고지식 로그인' })}
        </Text>
        <Text variant="body" style={[styles.description, { color: colors.textSecondary }]}>
          {t('auth.loginDesc', { defaultValue: '한국 전통 음식 추천 및 역사 탐색 서비스' })}
        </Text>
        <Button
          title={t('auth.googleLogin', { defaultValue: 'Google로 로그인' })}
          onPress={handleGoogleLogin}
          loading={isPending}
          disabled={isPending}
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
  logo: {
    width: 88,
    height: 88,
    marginBottom: 24,
    borderRadius: 20,
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

