import 'react-native-reanimated';
import * as WebBrowser from 'expo-web-browser';
WebBrowser.maybeCompleteAuthSession();

import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { DarkTheme as NavDarkTheme, DefaultTheme as NavDefaultTheme, ThemeProvider as NavigationThemeProvider } from '@react-navigation/native';
import { PaperProvider, adaptNavigationTheme } from 'react-native-paper';
import { Stack } from 'expo-router';

import { Provider } from 'react-redux';
import { store } from '@/src/store';
import { useColorScheme } from 'react-native';

// Adaptar temas de Navigation para Paper (evitar conflicto MD3)
const { LightTheme: AdaptedLightTheme, DarkTheme: AdaptedDarkTheme } = adaptNavigationTheme({
  reactNavigationLight: NavDefaultTheme,
  reactNavigationDark: NavDarkTheme,
});

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const theme = colorScheme === 'dark' ? AdaptedDarkTheme : AdaptedLightTheme;

  return (
    <Provider store={store}>
      <PaperProvider theme={theme}>
        <NavigationThemeProvider value={theme}>
          {/* Stack debe ser el componente principal de navegación */}
          <Stack>
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
            <Stack.Screen name="auth/index" options={{ title: 'Auth' }} />
            <Stack.Screen name="dashboard/basic" options={{ title: 'Dashboard (Basic)' }} />
            <Stack.Screen name="dashboard/premium" options={{ title: 'Dashboard (Premium)' }} />
            <Stack.Screen name="auth/mfa-setup" options={{ title: 'Enable MFA (TOTP)' }} />
            <Stack.Screen name="auth/mfa-challenge" options={{ title: 'Verify MFA' }} />
            
            {/* Agregar las nuevas pantallas que necesitas */}
            <Stack.Screen name="coach/CoachProfile" options={{ title: 'Perfil del Coach' }} />
            <Stack.Screen name="session/SessionScreen" options={{ title: 'Sesión en Curso' }} />
          </Stack>
          <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
        </NavigationThemeProvider>
      </PaperProvider>
    </Provider>
  );
}