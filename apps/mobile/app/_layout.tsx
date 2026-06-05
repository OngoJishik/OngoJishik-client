import React, { useEffect } from 'react';
import { Stack } from 'expo-router';
import { Provider as JotaiProvider, useAtomValue } from 'jotai';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from '@ongo/ui';
import { languageAtom } from '@ongo/store';
import { useTranslation } from '@ongo/i18n';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

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
 * 모바일 앱 최상위 Root Layout 컴포넌트
 * @author Antigravity
 */
export function RootLayout() {
  return (
    <JotaiProvider>
      <QueryClientProvider client={queryClient}>
        <I18nInitializer>
          <ThemeProvider>
            <Stack screenOptions={{ headerShown: false }} />
          </ThemeProvider>
        </I18nInitializer>
      </QueryClientProvider>
    </JotaiProvider>
  );
}

export { RootLayout as default };

