// app/session/[id].tsx
import { useLocalSearchParams, useRouter, type Href } from 'expo-router';
import SessionScreen from './SessionScreen';

export default function SessionPage() {
  const router = useRouter();
  const { id, name, spec, price } = useLocalSearchParams<{
    id: string; name?: string; spec?: string; price?: string;
  }>();

  return (
    <SessionScreen
      coachId={id}
      coachName={typeof name === 'string' ? name : undefined}
      specialty={typeof spec === 'string' ? spec : undefined}
      price={typeof price === 'string' ? Number(price) : undefined}
      onBack={() => router.replace('/search' as Href)}
    />
  );
}
