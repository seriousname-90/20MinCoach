import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, Button, Alert } from 'react-native';
import { useRouter, Href } from 'expo-router';
import { useDispatch, useSelector } from 'react-redux';

import { requestEmailOtp, verifyEmailOtp, getUser, getSession } from '@/src/services/auth/supabaseAuth';
import { fetchAuthSnapshot } from '@/src/services/auth/session';
import { setAuth } from '@/src/store/slices/auth';
import type { RootState } from '@/src/store';
import { listFactors } from '@/src/services/auth/mfa';


export default function AuthScreen() {
  const router = useRouter();
  const dispatch = useDispatch();
  const auth = useSelector((s: RootState) => s.auth);

  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [userEmail, setUserEmail] = useState<string | null>(null);

  const emailBorder = '#71b92efb';
  const codeBorder  = '#e41818ff';

  useEffect(() => {
    (async () => {
      const u = await getUser();
      setUserEmail(u?.email ?? null);
    })();
  }, []);

  const onRequestOtp = async () => {
    try {
      if (!email.trim()) return Alert.alert('Email requerido');
      await requestEmailOtp(email.trim());
      Alert.alert('Enviado', 'Revisa tu correo. Ingresa el código de 6 dígitos aquí.');
    } catch (e: any) {
      Alert.alert('Error', e.message ?? 'No se pudo enviar el código');
    }
  };

  const onVerify = async () => {
    try {
      if (!email.trim() || !code.trim()) return Alert.alert('Faltan datos');
      await verifyEmailOtp(email.trim(), code.trim());

      // Actualiza sesión y Redux
      const s = await getSession();
      const u = await getUser();
      setUserEmail(u?.email ?? null);

      const snap = await fetchAuthSnapshot();
      dispatch(setAuth(snap));

      // (OPCIONAL IMPLEMENTADO) Si ya tiene TOTP, pedir verificación MFA primero
      const factors = await listFactors();
      if (factors.length > 0) {
        Alert.alert('MFA', 'Debes verificar tu MFA (TOTP).');
        router.replace('/auth/mfa-challenge' as Href);
        return;
      }

      // Si no tiene TOTP, redirección por rol
      const roles = snap.roles || [];
      if (roles.includes('PremiumUser')) router.replace('/dashboard/premium' as Href);
      else router.replace('/dashboard/basic' as Href);

      Alert.alert('OK', s ? 'Sesión activa' : 'No se pudo iniciar sesión');
    } catch (e: any) {
      Alert.alert('Error', e.message ?? 'Código inválido');
    }
  };

  return (
    <View style={{ padding: 16, gap: 12 }}>
      <Text style={{ fontSize: 18, fontWeight: '700' }}>Login con OTP (Supabase)</Text>

      <TextInput
        value={email}
        onChangeText={setEmail}
        placeholder="tu@correo.com"
        autoCapitalize="none"
        keyboardType="email-address"
        style={{
          borderWidth: 1,
          borderColor: emailBorder,
          borderRadius: 8,
          padding: 10,
          color: emailBorder,
          backgroundColor: 'transparent',
        }}
        cursorColor={emailBorder}
        selectionColor={emailBorder}
        placeholderTextColor={emailBorder}
      />
      <Button title="Enviar código al correo" onPress={onRequestOtp} />

      <TextInput
        value={code}
        onChangeText={setCode}
        placeholder="Código de 6 dígitos"
        keyboardType="number-pad"
        maxLength={6}
        style={{
          borderWidth: 1,
          borderColor: codeBorder,
          borderRadius: 8,
          padding: 10,
          color: codeBorder,
          backgroundColor: 'transparent',
        }}
        cursorColor={codeBorder}
        selectionColor={codeBorder}
        placeholderTextColor={codeBorder}
      />
      <Button title="Verificar código" onPress={onVerify} />

      <Text style={{ marginTop: 12 }}>
        {userEmail ? `Logueado como: ${userEmail}` : 'No has iniciado sesión'}
      </Text>

      {!!auth.email && (
        <Text style={{ marginTop: 6 }}>
          Redux → email: {auth.email} | roles: {auth.roles.join(', ') || '—'}
        </Text>
      )}
    </View>
  );
}
