// app/tools/realtime-demo.tsx
import React, { useEffect } from 'react';
import { View, Text, Alert, Platform } from 'react-native';

// NOTA: import dinámico para evitar error si no está instalada
export default function RealtimeDemo() {
  useEffect(() => {
    let unsubPresence: (() => void) | undefined;
    let unsubSession: (() => void) | undefined;

    (async () => {
      try {
        // suscripciones simuladas (sin expo-notifications)
        const { subscribePresence, subscribeSession } = await import('@/src/services/realtime/realtime');

        unsubPresence = subscribePresence((data) => {
          console.log('📡 Presence event:', data);
        });

        unsubSession = subscribeSession(async (data) => {
          console.log('📡 Session event:', data);
          // si luego instalan expo-notifications, se puede disparar aquí
          try {
            const mod = await import('expo-notifications');
            if (data.status === 'accepted') {
              await mod.scheduleNotificationAsync({
                content: {
                  title: 'Coach aceptó tu sesión 🎉',
                  body: `El coach ${data.coachName} aceptó tu sesión.`,
                },
                trigger: null,
              });
            }
          } catch {
            // módulo no instalado → ignorar
          }
        });
      } catch (e: any) {
        Alert.alert('Realtime demo', e?.message ?? 'No se pudo iniciar la demo');
      }
    })();

    return () => {
      try { unsubPresence?.(); } catch {}
      try { unsubSession?.(); } catch {}
    };
  }, []);

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text>Simulación de Tiempo Real</Text>
      <Text style={{ color: '#666', marginTop: 8 }}>Ruta: /tools/realtime-demo</Text>
      <Text style={{ color: '#666', marginTop: 4 }}>
        {Platform.OS} • expo-notifications {`(opcional)`}
      </Text>
    </View>
  );
}
