import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import { useRouter, type Href } from 'expo-router';
import { useDispatch } from 'react-redux';

import { listFactors, challengeAndVerifyTotp } from '@/src/services/auth/mfa';
import { fetchAuthSnapshot } from '@/src/services/auth/session';
import { setAuth } from '@/src/store/slices/auth';

const BLUE = '#007AFF';

export default function MfaChallengeScreen() {
  const router = useRouter();
  const dispatch = useDispatch();

  const [factors, setFactors] = useState<{ id: string }[]>([]);
  const [selectedFactorId, setSelectedFactorId] = useState<string | null>(null);
  const [code, setCode] = useState('');

  const loadFactors = async () => {
    const list = await listFactors();
    setFactors(list);
    setSelectedFactorId(list[0]?.id ?? null);
  };

  useEffect(() => {
    (async () => {
      try {
        await loadFactors();
      } catch (e: any) {
        Alert.alert('Error', e.message ?? 'No se pudieron listar factores');
      }
    })();
  }, []);

  const onVerify = async () => {
    try {
      if (!selectedFactorId || !code.trim()) return Alert.alert('Faltan datos');
      await challengeAndVerifyTotp(selectedFactorId, code.trim());

      // Refresca sesión/roles y redirige por rol
      const snap = await fetchAuthSnapshot();
      dispatch(setAuth(snap));

      const roles = snap.roles || [];
      if (roles.includes('PremiumUser')) router.replace('/dashboard/premium' as Href);
      else router.replace('/dashboard/basic' as Href);

      Alert.alert('OK', 'MFA verificada');
    } catch (e: any) {
      Alert.alert('Error', e.message ?? 'Código inválido');
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#f5f5f5' }}>
      {/* Header */}
      <View style={{ padding: 20, backgroundColor: 'white' }}>
        <Text style={{ fontSize: 28, fontWeight: 'bold', marginBottom: 6 }}>Verify MFA</Text>
        <Text style={{ color: '#666' }}>
          Ingresa tu código TOTP de 6 dígitos.
        </Text>
      </View>

      {/* Card */}
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
          gap: 12,
        }}
      >
        {factors.length === 0 ? (
          <Text style={{ color: '#666' }}>
            No hay factores TOTP registrados. Habilita MFA primero desde tu dashboard.
          </Text>
        ) : (
          <>
            <Text style={{ color: '#111', fontWeight: '600' }}>
              Factor TOTP: <Text style={{ color: '#666', fontFamily: 'monospace' }}>{selectedFactorId}</Text>
            </Text>

            <TextInput
              value={code}
              onChangeText={setCode}
              placeholder="Código TOTP (6 dígitos)"
              keyboardType="number-pad"
              maxLength={6}
              style={{
                borderWidth: 1,
                borderColor: '#ddd',
                borderRadius: 8,
                padding: 12,
                color: '#111',
                backgroundColor: 'white',
              }}
              cursorColor={BLUE}
              selectionColor={BLUE}
              placeholderTextColor="#9ca3af"
            />

            {/* Botón primario */}
            <TouchableOpacity
              onPress={onVerify}
              style={{ backgroundColor: BLUE, paddingVertical: 12, borderRadius: 10, alignItems: 'center' }}
            >
              <Text style={{ color: 'white', fontWeight: '700' }}>Verificar</Text>
            </TouchableOpacity>

            {/* Secundario: refrescar factores */}
            <TouchableOpacity
              onPress={() => loadFactors().catch(() => {})}
              style={{ borderWidth: 1, borderColor: '#ddd', paddingVertical: 12, borderRadius: 10, alignItems: 'center' }}
            >
              <Text style={{ color: '#333', fontWeight: '700' }}>Refrescar factores</Text>
            </TouchableOpacity>
          </>
        )}
      </View>
    </View>
  );
}
