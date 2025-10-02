import React from 'react';
import { View, Text, Button } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState } from '@/src/store';
import { useRouter, type Href } from 'expo-router';
import { clearAuth } from '@/src/store/slices/auth';
import { signOut } from '@/src/services/auth/supabaseAuth';
import { RequireAuth, RequireRole, RoleGate, can } from '@/src/middleware/auth.guard';
import { httpJson } from '@/src/services/http';

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
    <RequireAuth isAuthed={!!email}>
      <RequireRole roles={roles} allowed={can.B} fallbackHref={'/dashboard/basic' as Href}>
        <View style={{ padding: 16, gap: 12 }}>
          <Text style={{ fontSize: 18, fontWeight: '700' }}>Dashboard (Premium)</Text>
          <Text>Hola: {email ?? '—'}</Text>
          <Text>Roles: {roles.join(', ') || '—'}</Text>

          {/* Acción A: visible también para Basic */}
          <RoleGate roles={roles} action="A">
            <Button title="Start 20-min request" onPress={() => { /* TODO */ }} />
          </RoleGate>

          {/* Acción B: solo Premium */}
          <RoleGate roles={roles} action="B">
            <Button title="View earnings" onPress={() => { /* TODO */ }} />
          </RoleGate>

          {/* Navegar a prueba de datos */}
          <Button title="Data Test (Query)" onPress={() => router.push('/tools/data-test' as Href)} />

          {/* PoC Interceptor: Forzar 401 */}
          <Button
            title="Forzar 401"
            onPress={() => httpJson('https://httpbin.org/status/401').catch(() => {})}
          />

          <Button title="Enable MFA (TOTP)" onPress={() => router.push('/auth/mfa-setup' as Href)} />
          <Button title="Log out" onPress={onLogout} />
        </View>
      </RequireRole>
    </RequireAuth>
  );
}
