import React, { useEffect, useState } from 'react';
import { View, Text, Button, TextInput, Alert } from 'react-native';
import { listFactors, challengeAndVerifyTotp } from '@/src/services/auth/mfa';
import { useRouter, type Href } from 'expo-router';
import { fetchAuthSnapshot } from '@/src/services/auth/session';
import { useDispatch } from 'react-redux';
import { setAuth } from '@/src/store/slices/auth';

const BLUE = '#3B82F6';

export default function MfaChallengeScreen() {
  const router = useRouter();
  const dispatch = useDispatch();

  const [factors, setFactors] = useState<{ id: string }[]>([]);
  const [selectedFactorId, setSelectedFactorId] = useState<string | null>(null);
  const [code, setCode] = useState('');

  useEffect(() => {
    (async () => {
      try {
        const list = await listFactors();
        setFactors(list);
        setSelectedFactorId(list[0]?.id ?? null);
      } catch (e: any) {
        Alert.alert('Error', e.message ?? 'No se pudieron listar factores');
      }
    })();
  }, []);

  const onVerify = async () => {
    try {
      if (!selectedFactorId || !code.trim()) return Alert.alert('Faltan datos');
      await challengeAndVerifyTotp(selectedFactorId, code.trim());

      // Refresca sesión, roles y Redux
      const snap = await fetchAuthSnapshot();
      dispatch(setAuth(snap));

      // Redirige explícitamente según rol (no uses back)
      const roles = snap.roles || [];
      if (roles.includes('PremiumUser')) {
        router.replace('/dashboard/premium' as Href);
      } else {
        router.replace('/dashboard/basic' as Href);
      }

      Alert.alert('OK', 'MFA verificada');
    } catch (e: any) {
      Alert.alert('Error', e.message ?? 'Código inválido');
    }
  };

  return (
    <View style={{ padding: 16, gap: 12 }}>
      <Text style={{ fontSize: 18, fontWeight: '700', color: BLUE }}>Verify MFA</Text>

      {factors.length === 0 ? (
        <Text style={{ color: BLUE }}>No hay factores TOTP registrados. Habilita MFA primero.</Text>
      ) : (
        <>
          <Text style={{ color: BLUE }}>Factor TOTP: {selectedFactorId}</Text>

          <TextInput
            value={code}
            onChangeText={setCode}
            placeholder="Código TOTP (6 dígitos)"
            keyboardType="number-pad"
            maxLength={6}
            style={{
              borderWidth: 1,
              borderColor: BLUE,
              borderRadius: 8,
              padding: 10,
              color: BLUE,
              backgroundColor: 'transparent',
            }}
            cursorColor={BLUE}
            selectionColor={BLUE}
            placeholderTextColor={BLUE}
          />

          <Button title="Verificar" onPress={onVerify} />
        </>
      )}
    </View>
  );
}
