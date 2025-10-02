import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import { useRouter, type Href } from 'expo-router';
import { useDispatch, useSelector } from 'react-redux';

import { signInWithPassword, signUpWithPassword, getSession } from '@/src/services/auth/supabaseAuth';
import { fetchAuthSnapshot } from '@/src/services/auth/session';
import { setAuth } from '@/src/store/slices/auth';
import { listFactors } from '@/src/services/auth/mfa';
import type { RootState } from '@/src/store';

const BLUE = '#007AFF';

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

      // Si tiene TOTP, ir a challenge antes de entrar
      try {
        const factors = await listFactors();
        if (factors.length > 0) {
          router.replace('/auth/mfa-challenge' as Href);
          return;
        }
      } catch {
        /* noop */
      }

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
    <View style={{ flex: 1, backgroundColor: '#f5f5f5' }}>
      {/* Header */}
      <View style={{ padding: 20, backgroundColor: 'white' }}>
        <Text style={{ fontSize: 28, fontWeight: 'bold', marginBottom: 6 }}>Bienvenido 👋</Text>
        <Text style={{ color: '#666' }}>Inicia sesión para continuar</Text>
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
        <Text style={{ fontWeight: '700', fontSize: 16, marginBottom: 4, color: '#111' }}>
          Login (Email + Password)
        </Text>

        <TextInput
          value={email}
          onChangeText={setEmail}
          placeholder="tu@correo.com"
          autoCapitalize="none"
          keyboardType="email-address"
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

        <TextInput
          value={password}
          onChangeText={setPassword}
          placeholder="Contraseña"
          secureTextEntry
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
          onPress={onSignIn}
          style={{
            backgroundColor: BLUE,
            paddingVertical: 12,
            borderRadius: 10,
            alignItems: 'center',
          }}
        >
          <Text style={{ color: 'white', fontWeight: '700' }}>Iniciar sesión</Text>
        </TouchableOpacity>

        {/* Botón secundario (outline) */}
        <TouchableOpacity
          onPress={onSignUp}
          style={{
            borderWidth: 1,
            borderColor: BLUE,
            paddingVertical: 12,
            borderRadius: 10,
            alignItems: 'center',
          }}
        >
          <Text style={{ color: BLUE, fontWeight: '700' }}>Crear cuenta</Text>
        </TouchableOpacity>

        {!!auth.email && (
          <Text style={{ marginTop: 6, color: '#666' }}>
            Redux → email: {auth.email} | roles: {auth.roles.join(', ') || '—'}
          </Text>
        )}
      </View>
    </View>
  );
}
