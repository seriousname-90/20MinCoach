// app/coach/[id].tsx
import { useLocalSearchParams, useRouter, type Href } from 'expo-router';
import CoachProfile from './CoachProfile';

export default function CoachPage() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();

  // Si desde el perfil inician sesión de 20min, navega a /session/[id] con query
  const onStartSession = (coach: any) => {
    const q = new URLSearchParams({
      name: coach?.name ?? '',
      spec: coach?.specialties?.[0] ?? '',
      price: String(coach?.hourlyRate ?? ''),
    }).toString();
    router.push(`/session/${id}?${q}` as Href);
  };

  return (
    <CoachProfile
      coachId={id}
      onBack={() => (router.canGoBack() ? router.back() : router.replace('/search' as Href))}
      onStartSession={onStartSession}
    />
  );
}
