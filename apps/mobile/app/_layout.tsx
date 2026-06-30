import React, { Suspense, useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import { Stack, Redirect, useSegments } from 'expo-router';
import { Provider as JotaiProvider, useAtomValue } from 'jotai';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { useTranslation } from '@ongo/i18n';
import { ThemeProvider } from '@ongo/ui';
import { languageAtom, authTokenAtom } from '@ongo/store';

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
 * 인증 상태에 따라 라우팅을 분기하는 컴포넌트
 * 인증 판단은 isAuthenticatedAtom(getOnInit) 단일 소스에서 가져오고,
 * 라우팅은 선언적 <Redirect>로 처리해 effect/네비게이터 마운트 타이밍에 영향받지 않음
 * @author Antigravity
 */
function AuthNavigator() {
  const segments = useSegments();
  // authTokenAtom을 직접 구독한다. getOnInit으로 AsyncStorage 읽기가 끝날 때까지 이 읽기는
  // Suspense로 대기되고, 해소되면 실제 값(문자열 토큰 또는 null)을 반환한다.
  // (파생 isAuthenticatedAtom은 동기 atom이라 미해소 Promise를 truthy로 오판하는 문제가 있어 직접 판정)
  const authToken = useAtomValue(authTokenAtom);
  const isAuthenticated = typeof authToken === 'string' && authToken.length > 0;

  const inAuthGroup = segments[0] === '(auth)';
  const needsLogin = !isAuthenticated && !inAuthGroup;
  const needsTabs = isAuthenticated && inAuthGroup;

  return (
    <>
      <Stack screenOptions={{ headerShown: false }} />
      {needsLogin && <Redirect href="/(auth)/login" />}
      {needsTabs && <Redirect href="/(tabs)" />}
      {/* 리다이렉트가 적용되어 segments가 갱신되기 전까지 직전 화면(메인)이 깜빡이지 않도록 가림 */}
      {(needsLogin || needsTabs) && <View style={styles.overlay} />}
    </>
  );
}

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#FAFAF8',
  },
});

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
              <Suspense fallback={<View style={styles.overlay} />}>
                <AuthNavigator />
              </Suspense>
            </ThemeProvider>
          </I18nInitializer>
        </QueryClientProvider>
      </JotaiProvider>
    </SafeAreaProvider>
  );
}

export { RootLayout as default };


