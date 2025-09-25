// app/_layout.tsx - VERSIÓN CORREGIDA
import { 
  DarkTheme as NavDarkTheme, 
  DefaultTheme as NavDefaultTheme, 
  ThemeProvider 
} from '@react-navigation/native';
import { PaperProvider, adaptNavigationTheme } from 'react-native-paper';
import { Stack } from 'expo-router'; 
import { StatusBar } from 'expo-status-bar';
import { useColorScheme } from 'react-native'
import 'react-native-reanimated'; 

// Usar alias diferentes para evitar conflicto
const { LightTheme: NavLightTheme, DarkTheme: NavDarkThemeAdapted } = adaptNavigationTheme({
  reactNavigationLight: NavDefaultTheme,
  reactNavigationDark: NavDarkTheme,
});

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const theme = colorScheme === 'dark' ? NavDarkThemeAdapted : NavLightTheme;

  return (
    <PaperProvider theme={theme}>
      <ThemeProvider value={theme}>
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="modal" options={{ presentation: 'modal' }} />
        </Stack>
        <StatusBar style="auto" />
      </ThemeProvider>
    </PaperProvider>
  );
}