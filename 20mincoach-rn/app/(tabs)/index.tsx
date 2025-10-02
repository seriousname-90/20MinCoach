// app/index.tsx
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter, type Href } from 'expo-router';
import { useColorScheme } from 'react-native';

export default function RootIndex() {
  const router = useRouter();
  const scheme = useColorScheme();
  const isDark = scheme === 'dark';

  const onGoAuth = () => router.replace('/auth' as Href);

  return (
    <View style={[styles.container, { backgroundColor: isDark ? '#0b1220' : '#f7fbff' }]}>
      <View style={[styles.card, { backgroundColor: isDark ? '#111827' : '#ffffff', borderColor: isDark ? '#1f2937' : '#e5e7eb' }]}>
        <Text style={[styles.title, { color: isDark ? '#60a5fa' : '#1f2937' }]}>
          20minCoach
        </Text>
        <Text style={[styles.subtitle, { color: isDark ? '#93c5fd' : '#374151' }]}>
          Bienvenido 👋
        </Text>
        <Text style={[styles.body, { color: isDark ? '#cbd5e1' : '#4b5563' }]}>
          Conecta con coaches verificados y agenda una sesión de 20 minutos.
        </Text>

        <TouchableOpacity style={styles.cta} onPress={onGoAuth}>
          <Text style={styles.ctaText}>Ir a autenticación</Text>
        </TouchableOpacity>

        <Text style={[styles.note, { color: isDark ? '#94a3b8' : '#6b7280' }]}>
          Necesitas iniciar sesión para continuar.
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 },
  card: {
    width: '100%',
    maxWidth: 460,
    borderRadius: 16,
    paddingVertical: 28,
    paddingHorizontal: 22,
    borderWidth: 1
  },
  title: { fontSize: 28, fontWeight: '800', letterSpacing: 0.2, marginBottom: 6 },
  subtitle: { fontSize: 18, fontWeight: '700', marginBottom: 10 },
  body: { fontSize: 15, lineHeight: 22, marginBottom: 22 },
  cta: {
    backgroundColor: '#3B82F6',
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 3,
  },
  ctaText: { color: 'white', fontWeight: '700', fontSize: 16 },
  note: { textAlign: 'center', marginTop: 12, fontSize: 12 },
});
