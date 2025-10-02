import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import { setPassword } from '@/src/services/auth/supabaseAuth';

const BLUE = '#007AFF';

export default function SetPasswordScreen() {
  const [pwd, setPwd] = useState('');
  const [pwd2, setPwd2] = useState('');

  const onSave = async () => {
    try {
      if (!pwd || pwd !== pwd2) return Alert.alert('Error', 'Las contraseñas no coinciden');
      await setPassword(pwd);
      Alert.alert('OK', 'Contraseña actualizada. Cierra sesión e inicia con la nueva contraseña.');
    } catch (e: any) {
      Alert.alert('Error', e.message ?? 'No se pudo actualizar la contraseña');
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#f5f5f5' }}>
      {/* Header */}
      <View style={{ padding: 20, backgroundColor: 'white' }}>
        <Text style={{ fontSize: 28, fontWeight: 'bold', marginBottom: 6 }}>Set password</Text>
        <Text style={{ color: '#666' }}>Define tu contraseña para el login con email + password.</Text>
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
        <TextInput
          value={pwd}
          onChangeText={setPwd}
          placeholder="Nueva contraseña"
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

        <TextInput
          value={pwd2}
          onChangeText={setPwd2}
          placeholder="Repetir contraseña"
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

        <TouchableOpacity
          onPress={onSave}
          style={{ backgroundColor: BLUE, paddingVertical: 12, borderRadius: 10, alignItems: 'center' }}
        >
          <Text style={{ color: 'white', fontWeight: '700' }}>Guardar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
