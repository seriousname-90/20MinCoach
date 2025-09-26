import { View, Text, Button } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState } from '@/src/store';
import { useRouter } from 'expo-router';
import { clearAuth } from '@/src/store/slices/auth';
import { signOut } from '@/src/services/auth/supabaseAuth';

export default function PremiumDashboard() {
  const { email, roles } = useSelector((s: RootState) => s.auth);
  const dispatch = useDispatch();
  const router = useRouter();

  const onLogout = async () => {
    await signOut();
    dispatch(clearAuth());
    router.replace('/auth');
  };

  return (
    <View style={{ padding: 16, gap: 12 }}>
      <Text style={{ fontSize: 18, fontWeight: '700' }}>Dashboard (Premium)</Text>
      <Text>Hola: {email ?? '—'}</Text>
      <Text>Roles: {roles.join(', ') || '—'}</Text>

      {/* Acción A */}
      <Button title="Start 20-min request" onPress={() => { /* TODO */ }} />

      {/* Acción B (solo Premium) */}
      <Button title="View earnings" onPress={() => { /* TODO */ }} />

      {/* Logout aquí */}
      <Button title="Log out" onPress={onLogout} />
    </View>
  );
}
