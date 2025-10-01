import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert } from 'react-native';
import { useRouter, type Href } from 'expo-router';
import { useDispatch, useSelector } from 'react-redux';

import { signInWithPassword, signUpWithPassword, getSession } from '@/src/services/auth/supabaseAuth';
import { fetchAuthSnapshot } from '@/src/services/auth/session';
import { setAuth } from '@/src/store/slices/auth';
import { listFactors } from '@/src/services/auth/mfa';
import type { RootState } from '@/src/store';

const BLUE = '#3B82F6';

export default function AuthScreen() {
  const router = useRouter();
  const dispatch = useDispatch();
  const auth = useSelector((s: RootState) => s.auth);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const goToDashboardByRole = async () => {
    const snap = await fetchAuthSnapshot();
    dispatch(setAuth(snap));
    const roles = snap.roles || [];
    if (roles.includes('PremiumUser')) router.replace('/dashboard/premium' as Href);
    else router.replace('/dashboard/basic' as Href);
  };

  const onSignIn = async () => {
    try {
      if (!email.trim() || !password) return Alert.alert('Datos requeridos', 'Email y contraseña');

      await signInWithPassword(email.trim(), password);

      // 1) Si tiene TOTP, obliga challenge ANTES de entrar a dashboards
      try {
        const factors = await listFactors(); // [{ id, createdAt, ... }]
        if (factors.length > 0) {
          // Tiene MFA habilitada → ir a challenge
          router.replace('/auth/mfa-challenge' as Href);
          return;
        }
      } catch {
        // si falla listFactors, seguimos con el flujo normal
      }

      // 2) Si no tiene TOTP, a dashboard por rol
      const s = await getSession();
      if (!s) return Alert.alert('Atención', 'No se pudo iniciar sesión');
      await goToDashboardByRole();
    } catch (e: any) {
      Alert.alert('Error', e.message ?? 'Credenciales inválidas');
    }
  };

  const onSignUp = async () => {
    try {
      if (!email.trim() || !password) return Alert.alert('Datos requeridos', 'Email y contraseña');
      await signUpWithPassword(email.trim(), password);
      Alert.alert('Cuenta creada', 'Ahora puedes iniciar sesión.');
    } catch (e: any) {
      Alert.alert('Error', e.message ?? 'No se pudo crear la cuenta');
    }
  };

  return (
    <View style={{ padding: 16, gap: 12 }}>
      <Text style={{ fontSize: 18, fontWeight: '700', color: BLUE }}>Login (Email + Password)</Text>

      <TextInput
        value={email}
        onChangeText={setEmail}
        placeholder="tu@correo.com"
        autoCapitalize="none"
        keyboardType="email-address"
        style={{ borderWidth: 1, borderColor: BLUE, borderRadius: 8, padding: 10, color: BLUE, backgroundColor: 'transparent' }}
        cursorColor={BLUE}
        selectionColor={BLUE}
        placeholderTextColor={BLUE}
      />

      <TextInput
        value={password}
        onChangeText={setPassword}
        placeholder="Contraseña"
        secureTextEntry
        style={{ borderWidth: 1, borderColor: BLUE, borderRadius: 8, padding: 10, color: BLUE, backgroundColor: 'transparent' }}
        cursorColor={BLUE}
        selectionColor={BLUE}
        placeholderTextColor={BLUE}
      />

      <Button title="Iniciar sesión" onPress={onSignIn} />
      <Button title="Crear cuenta" onPress={onSignUp} />

      {!!auth.email && (
        <Text style={{ marginTop: 6, color: BLUE }}>
          Redux → email: {auth.email} | roles: {auth.roles.join(', ') || '—'}
        </Text>
      )}
    </View>
  );
}
