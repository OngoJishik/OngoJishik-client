import React, { useEffect, useState } from 'react';
import { Stack, useRouter, useSegments } from 'expo-router';
import { Provider as JotaiProvider, useAtomValue } from 'jotai';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { useTranslation } from '@ongo/i18n';
import { ThemeProvider } from '@ongo/ui';
import { languageAtom, isAuthenticatedAtom } from '@ongo/store';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

// Configure Google Sign-In with safety checks
const webClientId = process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID;
const iosClientId = process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID;

if (webClientId) {
  GoogleSignin.configure({
    webClientId,
    iosClientId,
    offlineAccess: true,
  });
} else {
  if (process.env.NODE_ENV !== 'production') {
    console.warn('[GoogleSignin] EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID is missing. Google Sign-In will not be configured.');
  }
}

/**
 * Jotai languageAtom 상태와 i18n 인스턴스의 활성 언어를 실시간 동기화하는 컴포넌트
 * @author Antigravity
 */
function I18nInitializer({ children }: { children: React.ReactNode }) {
  const lang = useAtomValue(languageAtom);
  const { changeLanguage, currentLanguage } = useTranslation();

  useEffect(() => {
    if (currentLanguage !== lang) {
      changeLanguage(lang).catch((err) => {
        if (__DEV__) {
          console.error('Failed to change language in i18n:', err);
        }
      });
    }
  }, [lang, changeLanguage, currentLanguage]);

  return <>{children}</>;
}

/**
 * 인증 상태에 따라 라우팅을 분기 및 영속 상태 동기화를 대기하는 컴포넌트
 * @author Antigravity
 */
function AuthNavigator() {
  const segments = useSegments();
  const router = useRouter();
  const isAuthenticated = useAtomValue(isAuthenticatedAtom);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Manually retrieve the token once to synchronize loading screen
        await AsyncStorage.getItem('ongo_auth_token');
      } catch (e) {
        if (__DEV__) {
          console.error('Error checking auth token on start:', e);
        }
      } finally {
        setIsReady(true);
      }
    };
    checkAuth();
  }, []);

  useEffect(() => {
    if (!isReady) return;

    const inAuthGroup = segments[0] === '(auth)';

    if (!isAuthenticated && !inAuthGroup) {
      // Redirect to login if not authenticated and trying to access tabs/screens
      router.replace('/(auth)/login');
    } else if (isAuthenticated && inAuthGroup) {
      // Redirect to tabs if authenticated and on login screen
      router.replace('/(tabs)');
    }
  }, [isAuthenticated, segments, isReady, router]);

  if (!isReady) {
    return null; // Or a generic loading indicator
  }

  return <Stack screenOptions={{ headerShown: false }} />;
}

/**
 * 모바일 앱 최상위 Root Layout 컴포넌트
 * @author Antigravity
 */
export function RootLayout() {
  return (
    <SafeAreaProvider>
      <JotaiProvider>
        <QueryClientProvider client={queryClient}>
          <I18nInitializer>
            <ThemeProvider>
              <AuthNavigator />
            </ThemeProvider>
          </I18nInitializer>
        </QueryClientProvider>
      </JotaiProvider>
    </SafeAreaProvider>
  );
}

export { RootLayout as default };


