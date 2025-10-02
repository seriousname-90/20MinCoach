import React from 'react';
import { View, Text, Button, Alert } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState } from '@/src/store';
import { useRouter, type Href } from 'expo-router';
import { clearAuth } from '@/src/store/slices/auth';
import { signOut } from '@/src/services/auth/supabaseAuth';
import { RequireAuth, RoleGate } from '@/src/middleware/auth.guard';
import { httpJson } from '@/src/services/http';

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
    router.replace('/auth' as Href);
  };

  return (
    <RequireAuth isAuthed={!!email}>
      <View style={{ padding: 16, gap: 12 }}>
        <Text style={{ fontSize: 18, fontWeight: '700' }}>Dashboard (Basic)</Text>
        <Text>Hola: {email ?? '—'}</Text>
        <Text>Roles: {roles.join(', ') || '—'}</Text>

        {/* Acción A visible en ambos (Basic y Premium) */}
        <RoleGate roles={roles} action="A">
          <Button title="Start 20-min request" onPress={() => { /* TODO */ }} />
        </RoleGate>

        {/* Navegar a prueba de datos */}
        <Button title="Data Test (Query)" onPress={() => router.push('/tools/data-test' as Href)} />

        {/* Oferta Premium en vez de navegar */}
        <Button title="Desbloquear Premium" onPress={onBuyPremium} />

        {/* PoC Interceptor: Forzar 401 para validar limpieza de sesión y redirect a /auth */}
        <Button
          title="Forzar 401"
          onPress={() => httpJson('https://httpbin.org/status/401').catch(() => {})}
        />

        {/* Logout */}
        <Button title="Log out" onPress={onLogout} />
      </View>
    </RequireAuth>
  );
}
