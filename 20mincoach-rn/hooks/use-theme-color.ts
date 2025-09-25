// hooks/use-theme-color.ts (modificado)
import { useColorScheme } from 'react-native';
import { LightTheme, DarkTheme } from '~/constants/theme';

export function useThemeColor(
  props: { light?: string; dark?: string },
  colorName: keyof typeof LightTheme.colors
) {
  const theme = useColorScheme() ?? 'light';
  const currentTheme = theme === 'dark' ? DarkTheme : LightTheme;
  
  return props[theme] || currentTheme.colors[colorName];
}