import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import { useRouter, type Href } from 'expo-router';
import { useDispatch } from 'react-redux';

import { enrolTotp, verifyEnrolTotp } from '@/src/services/auth/mfa';
import { fetchAuthSnapshot } from '@/src/services/auth/session';
import { setAuth } from '@/src/store/slices/auth';

const BLUE = '#007AFF';

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
      setSecret(secret ?? null);

      if (!secret) {
        Alert.alert(
          'MFA',
          'No llegó el "secret" en la respuesta. Revisa la consola (data.totp). Si persiste, vuelve a intentar o actualiza @supabase/supabase-js.'
        );
      } else {
        Alert.alert('MFA', 'Agrega el secret a tu app de autenticación y luego ingresa el código.');
      }
    } catch (e: any) {
      Alert.alert('Error', e.message ?? 'No se pudo enrolar TOTP');
    }
  };

  const onVerify = async () => {
    try {
      if (!factorId || !code.trim()) return Alert.alert('Faltan datos');
      await verifyEnrolTotp(factorId, code.trim());

      const snap = await fetchAuthSnapshot();
      dispatch(setAuth(snap));

      const roles = snap.roles || [];
      if (roles.includes('PremiumUser')) router.replace('/dashboard/premium' as Href);
      else router.replace('/dashboard/basic' as Href);

      Alert.alert('OK', 'MFA habilitada con éxito');
    } catch (e: any) {
      Alert.alert('Error', e.message ?? 'Código inválido');
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#f5f5f5' }}>
      {/* Header */}
      <View style={{ padding: 20, backgroundColor: 'white' }}>
        <Text style={{ fontSize: 28, fontWeight: 'bold', marginBottom: 6 }}>Enable MFA (TOTP)</Text>
        <Text style={{ color: '#666' }}>
          Genera tu secret TOTP y verifica con un código de 6 dígitos.
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
        {!secret ? (
          <TouchableOpacity
            onPress={onEnrol}
            style={{ backgroundColor: BLUE, paddingVertical: 12, borderRadius: 10, alignItems: 'center' }}
          >
            <Text style={{ color: 'white', fontWeight: '700' }}>Generar secret TOTP</Text>
          </TouchableOpacity>
        ) : (
          <>
            <Text style={{ fontWeight: '600', color: '#111' }}>Secret (añádelo en tu App Auth):</Text>

            <View
              style={{
                borderWidth: 1,
                borderColor: '#ddd',
                borderRadius: 8,
                padding: 12,
                backgroundColor: '#fafafa',
              }}
            >
              <Text selectable style={{ fontFamily: 'monospace', color: '#111' }}>{secret}</Text>
              {factorId ? (
                <Text style={{ color: '#666', marginTop: 8 }}>
                  factorId: <Text style={{ fontFamily: 'monospace' }}>{factorId}</Text>
                </Text>
              ) : null}
            </View>

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

            <TouchableOpacity
              onPress={onVerify}
              style={{ backgroundColor: BLUE, paddingVertical: 12, borderRadius: 10, alignItems: 'center' }}
            >
              <Text style={{ color: 'white', fontWeight: '700' }}>Verificar y habilitar</Text>
            </TouchableOpacity>
          </>
        )}
      </View>
    </View>
  );
}
