// app/_layout.tsx
import 'react-native-reanimated';
import * as WebBrowser from 'expo-web-browser';
WebBrowser.maybeCompleteAuthSession();

import React, { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack, router, type Href } from 'expo-router';

import { Provider } from 'react-redux';
import { store } from '@/src/store';
import { clearAuth } from '@/src/store/slices/auth';
import { useColorScheme } from '@/hooks/use-color-scheme';

import { setOnUnauthorized } from '@/src/middleware/http.interceptor';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from '@/src/services/queryClient'; // asegúrate de tener este archivo

export default function RootLayout() {
  const colorScheme = useColorScheme();

  // Configurar respuesta global a 401 (interceptor)
  useEffect(() => {
    setOnUnauthorized(() => {
      store.dispatch(clearAuth());
      router.replace('/auth' as Href);
    });
    return () => setOnUnauthorized(null);
  }, []);

  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
          <Stack>
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
            <Stack.Screen name="auth/index" options={{ title: 'Auth' }} />
            <Stack.Screen name="dashboard/basic" options={{ title: 'Dashboard (Basic)' }} />
            <Stack.Screen name="dashboard/premium" options={{ title: 'Dashboard (Premium)' }} />
            <Stack.Screen name="auth/mfa-setup" options={{ title: 'Enable MFA (TOTP)' }} />
            <Stack.Screen name="auth/mfa-challenge" options={{ title: 'Verify MFA' }} />
            {/* Si tienes search/ y coach/[id]/ también se auto-registran por file-based routing */}
          </Stack>
          <StatusBar style="auto" />
        </ThemeProvider>
      </QueryClientProvider>
    </Provider>
  );
}
