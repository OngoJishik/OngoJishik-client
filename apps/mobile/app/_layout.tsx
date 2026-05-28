import React from 'react';
import { Slot } from 'expo-router';
import { Provider as JotaiProvider } from 'jotai';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from '@ongo/ui';
import '@ongo/i18n'; // Initializes i18n configurations

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

export default function RootLayout() {
  return (
    <JotaiProvider>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider>
          <Slot />
        </ThemeProvider>
      </QueryClientProvider>
    </JotaiProvider>
  );
}
