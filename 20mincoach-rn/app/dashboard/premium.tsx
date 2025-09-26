import { View, Text, Button } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState } from '@/src/store';
import { useRouter, type Href } from 'expo-router';
import { clearAuth } from '@/src/store/slices/auth';
import { signOut } from '@/src/services/auth/supabaseAuth';

export default function PremiumDashboard() {
  const { email, roles } = useSelector((s: RootState) => s.auth);
  const dispatch = useDispatch();
  const router = useRouter();

  const onLogout = async () => {
    await signOut();
    dispatch(clearAuth());
    router.replace('/auth' as Href);
  };

  return (
    <View style={{ padding: 16, gap: 12 }}>
      <Text style={{ fontSize: 18, fontWeight: '700' }}>Dashboard (Premium)</Text>
      <Text>Hola: {email ?? '—'}</Text>
      <Text>Roles: {roles.join(', ') || '—'}</Text>

      <Button title="Start 20-min request" onPress={() => { /* TODO */ }} />
      <Button title="View earnings" onPress={() => { /* TODO */ }} />
      <Button title="Enable MFA (TOTP)" onPress={() => router.push('/auth/mfa-setup' as Href)} />
      <Button title="Log out" onPress={onLogout} />
    </View>
  );
}
