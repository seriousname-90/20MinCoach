// app/auth/set-password.tsx
import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert } from 'react-native';
import { setPassword } from '@/src/services/auth/supabaseAuth';

const BLUE = '#3B82F6';

export default function SetPasswordScreen() {
  const [pwd, setPwd] = useState('');
  const [pwd2, setPwd2] = useState('');

  const onSave = async () => {
    try {
      if (!pwd || pwd !== pwd2) return Alert.alert('Error', 'Las contraseñas no coinciden');
      await setPassword(pwd);
      Alert.alert('OK', 'Contraseña actualizada. Prueba cerrar sesión e iniciar con password.');
    } catch (e: any) {
      Alert.alert('Error', e.message ?? 'No se pudo actualizar la contraseña');
    }
  };

  return (
    <View style={{ padding: 16, gap: 12 }}>
      <Text style={{ fontSize: 18, fontWeight: '700', color: BLUE }}>Set password</Text>

      <TextInput
        value={pwd}
        onChangeText={setPwd}
        placeholder="Nueva contraseña"
        secureTextEntry
        style={{ borderWidth: 1, borderColor: BLUE, borderRadius: 8, padding: 10, color: BLUE, backgroundColor: 'transparent' }}
        cursorColor={BLUE}
        selectionColor={BLUE}
        placeholderTextColor={BLUE}
      />
      <TextInput
        value={pwd2}
        onChangeText={setPwd2}
        placeholder="Repetir contraseña"
        secureTextEntry
        style={{ borderWidth: 1, borderColor: BLUE, borderRadius: 8, padding: 10, color: BLUE, backgroundColor: 'transparent' }}
        cursorColor={BLUE}
        selectionColor={BLUE}
        placeholderTextColor={BLUE}
      />

      <Button title="Guardar" onPress={onSave} />
    </View>
  );
}
