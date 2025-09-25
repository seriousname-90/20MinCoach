// constants/theme.ts
import { 
  MD3LightTheme as PaperLightTheme, 
  MD3DarkTheme as PaperDarkTheme 
} from 'react-native-paper';
import { 
  DefaultTheme as NavigationDefaultTheme, 
  DarkTheme as NavigationDarkTheme 
} from '@react-navigation/native';

// Tema CLARO - Aseguramos compatibilidad
export const LightTheme = {
  ...PaperLightTheme,
  colors: {
    ...PaperLightTheme.colors,
    ...NavigationDefaultTheme.colors, // 🔥 Integrar colores de Navigation
    primary: '#0066CC',
    accent: '#FF6B35',
    background: '#FFFFFF',
    surface: '#F8F9FA',
    onSurface: '#212121',
    error: '#D32F2F',
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
  }
};

// Tema OSCURO - Aseguramos compatibilidad
export const DarkTheme = {
  ...PaperDarkTheme,
  colors: {
    ...PaperDarkTheme.colors,
    ...NavigationDarkTheme.colors, // 🔥 Integrar colores de Navigation
    primary: '#4DABF5',
    accent: '#FF8A65',
    background: '#121212',
    surface: '#1E1E1E',
    onSurface: '#FFFFFF',
    error: '#CF6679',
  },
  spacing: LightTheme.spacing,
};

export type AppTheme = typeof LightTheme;