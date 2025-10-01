// components/ui/PrimaryButton.tsx
import { TouchableOpacity, Text, useWindowDimensions } from 'react-native';

interface PrimaryButtonProps {
  title: string;
  onPress: () => void;
  disabled?: boolean;
}

export function PrimaryButton({ title, onPress, disabled }: PrimaryButtonProps) {
  const { width } = useWindowDimensions();
  const isMobile = width < 768;
  
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled}
      style={{
        minWidth: isMobile ? '100%' : 200,
        paddingVertical: 12,
        backgroundColor: '#0066CC',
        borderRadius: 8,
        alignItems: 'center',
        opacity: disabled ? 0.5 : 1,
      }}
    >
      <Text style={{ color: 'white', fontSize: 16, fontWeight: '600' }}>
        {title}
      </Text>
    </TouchableOpacity>
  );
}