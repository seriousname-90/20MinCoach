// components/coach/CoachCard.tsx
import { Card, Avatar, Text } from 'react-native-paper';
import { View } from 'react-native';
import { Rating } from '../ui/Rating';
import { Coach } from '../../src/models/coach';

interface CoachCardProps {
  coach: Coach;
  onPress: () => void;
}

export function CoachCard({ coach, onPress }: CoachCardProps) {
  return (
    <Card onPress={onPress} style={{ margin: 8 }}>
      <Card.Content style={{ flexDirection: 'row', alignItems: 'center' }}>
        <Avatar.Image source={{ uri: coach.avatar }} size={60 } />
        <View style={{ marginLeft: 12, flex: 1 }}>
          <Text style={{ fontSize: 16, fontWeight: 'bold' }}>{coach.name}</Text>
          <Text style={{ fontSize: 14, color: '#666' }}>
            {coach.specialties.join(', ')}
          </Text>
          <Rating value={coach.rating} />
        </View>
      </Card.Content>
    </Card>
  );
}