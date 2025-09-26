import React, { useEffect } from 'react';
import * as Notifications from 'expo-notifications';
import { Button, View, Text } from 'react-native';
import { subscribePresence, subscribeSession } from '@/src/services/realtime/realtime';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

export default function App() {
  useEffect(() => {
    // Solicitar permisos
    const setupNotifications = async () => {
      const { status } = await Notifications.requestPermissionsAsync();
      if (status !== 'granted') {
        alert('Permiso para notificaciones no concedido');
        return;
      }

      const token = await Notifications.getExpoPushTokenAsync();
      console.log('Device token:', token);
    };
    setupNotifications();

    // Suscribirse a eventos simulados
    const unsubPresence = subscribePresence((data) => {
      console.log('📡 Presence event:', data);
    });

    const unsubSession = subscribeSession(async (data) => {
      console.log('📡 Session event:', data);
      if (data.status === 'accepted') {
        await Notifications.scheduleNotificationAsync({
          content: {
            title: 'Coach aceptó tu sesión 🎉',
            body: `El coach ${data.coachName} aceptó tu sesión.`,
          },
          trigger: null, // inmediata
        });
      }
    });

    return () => {
      unsubPresence();
      unsubSession();
    };
  }, []);

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Simulación de Tiempo Real</Text>
    </View>
  );
}
