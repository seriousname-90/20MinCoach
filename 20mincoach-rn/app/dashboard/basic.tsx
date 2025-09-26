import { View, Text, Button, Alert } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState } from '@/src/store';
import { useRouter } from 'expo-router';
import { clearAuth } from '@/src/store/slices/auth';
import { signOut } from '@/src/services/auth/supabaseAuth';

export default function BasicDashboard() {
  const { email, roles } = useSelector((s: RootState) => s.auth);
  const dispatch = useDispatch();
  const router = useRouter();

  const onBuyPremium = () => {
    Alert.alert(
      'Premium',
      'Compra Premium por $59.99/mes para desbloquear "View earnings".',
      [{ text: 'OK' }],
    );
  };

  const onLogout = async () => {
    await signOut();
    dispatch(clearAuth());
    router.replace('/auth');
  };

  return (
    <View style={{ padding: 16, gap: 12 }}>
      <Text style={{ fontSize: 18, fontWeight: '700' }}>Dashboard (Basic)</Text>
      <Text>Hola: {email ?? '—'}</Text>
      <Text>Roles: {roles.join(', ') || '—'}</Text>

      {/* Acción A visible en ambos */}
      <Button title="Start 20-min request" onPress={() => { /* TODO */ }} />

      {/* En vez de ir a Premium, mostramos oferta */}
      <Button title="Desbloquear Premium" onPress={onBuyPremium} />

      {/* Logout aquí */}
      <Button title="Log out" onPress={onLogout} />
    </View>
  );
}
