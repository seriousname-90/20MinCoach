// hooks/useResponsive.ts
import { useWindowDimensions, ScaledSize } from 'react-native';

export interface ResponsiveBreakpoints {
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  width: number;
  height: number;
  breakpoint: 'mobile' | 'tablet' | 'desktop';
}

export function useResponsive(): ResponsiveBreakpoints {
  const { width, height }: ScaledSize = useWindowDimensions();
  
  // Breakpoints estándar
  const breakpoints = {
    mobile: 768,    // < 768px: móvil
    tablet: 1024,   // 768px - 1024px: tablet
    desktop: 1025   // > 1024px: desktop
  };

  const isMobile = width < breakpoints.mobile;
  const isTablet = width >= breakpoints.mobile && width < breakpoints.tablet;
  const isDesktop = width >= breakpoints.desktop;

  return {
    isMobile,
    isTablet,
    isDesktop,
    width,
    height,
    breakpoint: isMobile ? 'mobile' : isTablet ? 'tablet' : 'desktop'
  };
}