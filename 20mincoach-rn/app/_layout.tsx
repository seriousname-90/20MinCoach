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
import { useColorScheme } from 'react-native';

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

// Adapt Navigation themes to Paper (MD3 friendly)
const { LightTheme: AdaptedLightTheme, DarkTheme: AdaptedDarkTheme } = adaptNavigationTheme({
  reactNavigationLight: NavDefaultTheme,
  reactNavigationDark: NavDarkTheme,
});

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const theme = colorScheme === 'dark' ? AdaptedDarkTheme : AdaptedLightTheme;

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
        <PaperProvider theme={theme}>
          <NavigationThemeProvider value={theme}>
            <Stack>
              {/* Tu árbol principal */}
              <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
              <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />

              {/* Auth + MFA */}
              <Stack.Screen name="auth/index" options={{ title: 'Auth' }} />
              <Stack.Screen name="auth/mfa-setup" options={{ title: 'Enable MFA (TOTP)' }} />
              <Stack.Screen name="auth/mfa-challenge" options={{ title: 'Verify MFA' }} />

              {/* Dashboards */}
              <Stack.Screen name="dashboard/basic" options={{ title: 'Dashboard (Basic)' }} />
              <Stack.Screen name="dashboard/premium" options={{ title: 'Dashboard (Premium)' }} />

              {/* Si el main de Carlos agregó rutas nuevas “named screens”, consérvalas */}
              <Stack.Screen name="coach/CoachProfile" options={{ title: 'Perfil del Coach' }} />
              <Stack.Screen name="session/SessionScreen" options={{ title: 'Sesión en Curso' }} />
              {/* OJO: además, Expo Router auto-registra por file-based routing:
                  - app/search/index.tsx
                  - app/coach/[id].tsx
                  - app/session/index.tsx
              */}
            </Stack>
            <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
          </NavigationThemeProvider>
        </PaperProvider>
      </QueryClientProvider>
    </Provider>
  );
}
