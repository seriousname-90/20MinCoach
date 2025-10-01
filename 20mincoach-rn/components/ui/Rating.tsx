import { View, Text } from 'react-native';

interface RatingProps {
  value: number;
  max?: number;
}

export function Rating({ value, max = 5 }: RatingProps) {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
      <Text>⭐</Text>
      <Text style={{ marginLeft: 4, fontSize: 14 }}>
        {value.toFixed(1)}/{max}
      </Text>
    </View>
  );
}