// components/layout/Grid.tsx
import React from 'react';
import { View, ViewProps } from 'react-native';
import { useResponsive } from '~/hooks/useResponsive';

interface GridProps extends ViewProps {
  children: React.ReactNode;
  columns?: number;
  gap?: number;
}

export function Grid({ 
  children, 
  columns = 1, 
  gap = 16,
  style, 
  ...props 
}: GridProps) {
  const { isMobile, isTablet, isDesktop } = useResponsive();

  // Columnas responsivas
  const responsiveColumns = isMobile ? 1 : isTablet ? 2 : columns;

  const gridStyle = {
    flexDirection: 'row' as const,
    flexWrap: 'wrap' as const,
    marginHorizontal: -gap / 2,
  };

  return (
    <View style={[gridStyle, style]} {...props}>
      {React.Children.map(children, (child, index) => (
        <View 
          style={{ 
            width: `${100 / responsiveColumns}%`,
            padding: gap / 2,
          }}
          key={index}
        >
          {child}
        </View>
      ))}
    </View>
  );
}