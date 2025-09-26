import React, { useState } from 'react';
import { View, Text, Button, TextInput, Alert } from 'react-native';
import { enrolTotp, verifyEnrolTotp } from '@/src/services/auth/mfa';
import { useRouter, type Href } from 'expo-router';
import { useDispatch } from 'react-redux';
import { fetchAuthSnapshot } from '@/src/services/auth/session';
import { setAuth } from '@/src/store/slices/auth';

const BLUE = '#3B82F6';

export default function MfaSetupScreen() {
  const router = useRouter();
  const dispatch = useDispatch();

  const [factorId, setFactorId] = useState<string | null>(null);
  const [secret, setSecret] = useState<string | null>(null);
  const [code, setCode] = useState('');

  const onEnrol = async () => {
    try {
      const { factorId, secret } = await enrolTotp();
      setFactorId(factorId);
      if (!secret) {
        Alert.alert(
          'MFA',
          'No llegó el "secret" en la respuesta. Revisa la consola (data.totp). Si persiste, vuelve a intentar o actualiza @supabase/supabase-js.'
        );
      }
      setSecret(secret ?? null);
      if (secret) {
        Alert.alert('MFA', 'Copia el secret en tu app de autenticación y luego ingresa el código.');
      }
    } catch (e: any) {
      Alert.alert('Error', e.message ?? 'No se pudo enrolar TOTP');
    }
  };

  const onVerify = async () => {
    try {
      if (!factorId || !code.trim()) return Alert.alert('Faltan datos');
      await verifyEnrolTotp(factorId, code.trim());

      // Refresca sesión/roles y guarda en Redux
      const snap = await fetchAuthSnapshot();
      dispatch(setAuth(snap));

      // Redirige: Premium -> premium dashboard; de lo contrario -> basic
      const roles = snap.roles || [];
      if (roles.includes('PremiumUser')) {
        router.replace('/dashboard/premium' as Href);
      } else {
        router.replace('/dashboard/basic' as Href);
      }

      Alert.alert('OK', 'MFA habilitada con éxito');
    } catch (e: any) {
      Alert.alert('Error', e.message ?? 'Código inválido');
    }
  };

  return (
    <View style={{ padding: 16, gap: 12 }}>
      <Text style={{ fontSize: 18, fontWeight: '700', color: BLUE }}>Enable MFA (TOTP)</Text>

      {!secret ? (
        <Button title="Generar secret TOTP" onPress={onEnrol} />
      ) : (
        <>
          <Text style={{ fontWeight: '600', color: BLUE }}>
            Secret (agrega manualmente en tu App Auth):
          </Text>
          <Text selectable style={{ fontFamily: 'monospace', color: BLUE }}>{secret}</Text>

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
          <Button title="Verificar y habilitar" onPress={onVerify} />
        </>
      )}
    </View>
  );
}
