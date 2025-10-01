// components/ui/ResponsiveText.tsx
import { Text, TextProps } from 'react-native';
import { useResponsive } from '~/hooks/useResponsive';

interface ResponsiveTextProps extends TextProps {
  size?: 'xs' | 'sm' | 'base' | 'lg' | 'xl' | '2xl';
  responsive?: boolean;
}

export function ResponsiveText({ 
  size = 'base', 
  responsive = true,
  style, 
  ...props 
}: ResponsiveTextProps) {
  const { isMobile, isTablet } = useResponsive();

  const sizeMap = {
    xs: { mobile: 10, tablet: 11, desktop: 12 },
    sm: { mobile: 12, tablet: 13, desktop: 14 },
    base: { mobile: 14, tablet: 15, desktop: 16 },
    lg: { mobile: 16, tablet: 18, desktop: 20 },
    xl: { mobile: 20, tablet: 22, desktop: 24 },
    '2xl': { mobile: 24, tablet: 28, desktop: 32 },
  };

  const fontSize = responsive 
    ? isMobile ? sizeMap[size].mobile 
      : isTablet ? sizeMap[size].tablet 
      : sizeMap[size].desktop
    : sizeMap[size].desktop;

  return (
    <Text style={[{ fontSize }, style]} {...props} />
  );
}