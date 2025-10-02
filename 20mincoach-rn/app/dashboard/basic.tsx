import React from 'react';
import { View, Text, TouchableOpacity, Alert } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState } from '@/src/store';
import { useRouter, type Href } from 'expo-router';
import { clearAuth } from '@/src/store/slices/auth';
import { signOut } from '@/src/services/auth/supabaseAuth';
import { RequireAuth, RoleGate } from '@/src/middleware/auth.guard';

const BLUE = '#007AFF';

export default function BasicDashboard() {
  const { email, roles } = useSelector((s: RootState) => s.auth);
  const dispatch = useDispatch();
  const router = useRouter();

  const onBuyPremium = () => {
    Alert.alert('Premium', 'Compra Premium por $59.99/mes para desbloquear "View earnings".', [{ text: 'OK' }]);
  };

  const onLogout = async () => {
    await signOut();
    dispatch(clearAuth());
    router.replace('/auth' as Href);
  };

  return (
    <RequireAuth isAuthed={!!email}>
      <View style={{ flex: 1, backgroundColor: '#f5f5f5' }}>
        {/* Header */}
        <View style={{ padding: 20, backgroundColor: 'white' }}>
          <Text style={{ fontSize: 28, fontWeight: 'bold' }}>Dashboard (Basic)</Text>
          <Text style={{ color: '#666', marginTop: 6 }}>
            Hola {email ?? '—'} • Roles: {roles.join(', ') || '—'}
          </Text>
        </View>

        {/* Card de acciones */}
        <View
          style={{
            margin: 16,
            padding: 16,
            borderRadius: 10,
            backgroundColor: 'white',
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.08,
            shadowRadius: 4,
            elevation: 2,
            gap: 10,
          }}
        >
          {/* Buscar coaches (primario) */}
          <TouchableOpacity
            onPress={() => router.push('/search' as Href)}
            style={{ backgroundColor: BLUE, paddingVertical: 14, borderRadius: 10, alignItems: 'center' }}
          >
            <Text style={{ color: 'white', fontWeight: '700' }}>🔎 Buscar coaches</Text>
          </TouchableOpacity>

          {/* Acción A visible en ambos */}
          <RoleGate roles={roles} action="A">
            <TouchableOpacity
              onPress={() => { /* hook into real action */ }}
              style={{
                borderWidth: 1, borderColor: BLUE, paddingVertical: 14, borderRadius: 10, alignItems: 'center',
              }}
            >
              <Text style={{ color: BLUE, fontWeight: '700' }}>Start 20-min request</Text>
            </TouchableOpacity>
          </RoleGate>

          {/* Oferta Premium */}
          <TouchableOpacity
            onPress={onBuyPremium}
            style={{ backgroundColor: '#ffd700', paddingVertical: 14, borderRadius: 10, alignItems: 'center' }}
          >
            <Text style={{ color: '#333', fontWeight: '800' }}>⭐ Desbloquear Premium</Text>
          </TouchableOpacity>

          {/* Logout */}
          <TouchableOpacity
            onPress={onLogout}
            style={{ backgroundColor: '#ef4444', paddingVertical: 14, borderRadius: 10, alignItems: 'center' }}
          >
            <Text style={{ color: 'white', fontWeight: '700' }}>Log out</Text>
          </TouchableOpacity>
        </View>
      </View>
    </RequireAuth>
  );
}
