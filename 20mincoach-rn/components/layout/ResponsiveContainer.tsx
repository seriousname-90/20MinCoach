// components/layout/ResponsiveContainer.tsx
import { View, ViewProps } from 'react-native';
import { useResponsive } from '~/hooks/useResponsive';
import { StyleSheet } from 'react-native';

interface ResponsiveContainerProps extends ViewProps {
  children: React.ReactNode;
  maxWidth?: number;
}

export function ResponsiveContainer({ 
  children, 
  style, 
  maxWidth = 1200,
  ...props 
}: ResponsiveContainerProps) {
  const { isMobile, isTablet, isDesktop, width } = useResponsive();

  const containerStyle = {
    flex: 1,
    width: '100%',
    maxWidth: isDesktop ? maxWidth : '100%',
    alignSelf: 'center' as const,
    paddingHorizontal: isMobile ? 16 : isTablet ? 24 : 32,
  };

  return (
    <View style={[styles.container, { maxWidth: isDesktop ? maxWidth : '100%', paddingHorizontal: isMobile ? 16 : isTablet ? 24 : 32 }, style]} {...props}>
    {children}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    alignSelf: 'center',
  },
});