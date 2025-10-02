// app/_layout.tsx
import 'react-native-reanimated';
import * as WebBrowser from 'expo-web-browser';
WebBrowser.maybeCompleteAuthSession();

import React, { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';

// THEME / NAV + PAPER
import {
  DarkTheme as NavDarkTheme,
  DefaultTheme as NavDefaultTheme,
  ThemeProvider as NavigationThemeProvider,
} from '@react-navigation/native';
import { PaperProvider, adaptNavigationTheme } from 'react-native-paper';
import { useColorScheme, LogBox } from 'react-native';

// ROUTER + STACK
import { Stack, router, type Href } from 'expo-router';

// REDUX
import { Provider } from 'react-redux';
import { store } from '@/src/store';
import { clearAuth } from '@/src/store/slices/auth';

// HTTP 401 interceptor
import { setOnUnauthorized } from '@/src/middleware/http.interceptor';

// REACT QUERY
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from '@/src/services/queryClient';

const { LightTheme: AdaptedLightTheme, DarkTheme: AdaptedDarkTheme } = adaptNavigationTheme({
  reactNavigationLight: NavDefaultTheme,
  reactNavigationDark: NavDarkTheme,
});

if (__DEV__) {
  LogBox.ignoreLogs([
    'Notifications: permission not granted',
    'expo-notifications: Android Push notifications (remote notifications) functionality provided by expo-notifications was removed from Expo Go',
  ]);
}

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const theme = colorScheme === 'dark' ? AdaptedDarkTheme : AdaptedLightTheme;

  useEffect(() => {
    setOnUnauthorized(() => {
      store.dispatch(clearAuth());
      router.replace('/auth' as Href);
    });
    return () => setOnUnauthorized(null);
  }, []);

  useEffect(() => {
    (async () => {
      try {
        const { initNotifications } = await import('@/src/services/notifications');
        await initNotifications();
      } catch (e) {
        // En dev, si algo falla aquí, no bloqueamos la app
        console.warn('Notifications init skipped:', (e as Error)?.message);
      }
    })();
  }, []);

  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <PaperProvider theme={theme}>
          <NavigationThemeProvider value={theme}>
            <Stack>
              {/* Main tree */}
              <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
              <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />

              {/* Auth + MFA */}
              <Stack.Screen name="auth/index" options={{ title: 'Auth' }} />
              <Stack.Screen name="auth/mfa-setup" options={{ title: 'Enable MFA (TOTP)' }} />
              <Stack.Screen name="auth/mfa-challenge" options={{ title: 'Verify MFA' }} />

              {/* Dashboards */}
              <Stack.Screen name="dashboard/basic" options={{ title: 'Dashboard (Basic)' }} />
              <Stack.Screen name="dashboard/premium" options={{ title: 'Dashboard (Premium)' }} />

              {/* Named screens extra (si las usan) */}
              <Stack.Screen name="coach/CoachProfile" options={{ title: 'Perfil del Coach' }} />
              <Stack.Screen name="session/SessionScreen" options={{ title: 'Sesión en Curso' }} />
              {/* Además, Expo Router auto-registra por file-based routing:
                  - app/search/index.tsx
                  - app/coach/[id].tsx
                  - app/session/[id].tsx
              */}
            </Stack>
            <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
          </NavigationThemeProvider>
        </PaperProvider>
      </QueryClientProvider>
    </Provider>
  );
}
