import 'react-native-reanimated';
import * as WebBrowser from 'expo-web-browser';
WebBrowser.maybeCompleteAuthSession();

import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';

import { Provider } from 'react-redux';
import { store } from '@/src/store';
import { useColorScheme } from '@/hooks/use-color-scheme';

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <Provider store={store}>
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
          <Stack.Screen name="auth/index" options={{ title: 'Auth' }} />
          <Stack.Screen name="dashboard/basic" options={{ title: 'Dashboard (Basic)' }} />
          <Stack.Screen name="dashboard/premium" options={{ title: 'Dashboard (Premium)' }} />
        </Stack>
        <StatusBar style="auto" />
      </ThemeProvider>
    </Provider>
  );
}
