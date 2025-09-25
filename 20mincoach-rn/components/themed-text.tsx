import { Text } from 'react-native';

export function ThemedText({ type = 'default', style, ...props }: any) {
  // Usar StyleSheet en lugar de variant
  const textStyle = type === 'title' ? { fontSize: 24, fontWeight: 'bold' } : { fontSize: 16 };
  
  return <Text style={[textStyle, style]} {...props} />;
} 