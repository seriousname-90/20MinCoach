// src/services/notifications.ts
import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import { router } from 'expo-router';

type AcceptedPayload = {
  type: 'accepted';
  sessionId: string;
  name: string;
  spec?: string;
  price?: number;
};

let inited = false;

export async function initNotifications() {
  if (inited) return;
  inited = true;

  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      // En Expo Go usa estos dos nuevos flags; keep both true para ver banner/lista
      shouldShowBanner: true,
      shouldShowList: true,
      // Estos campos heredados no hacen falta, pero no rompen:
      shouldShowAlert: false,
      shouldPlaySound: false,
      shouldSetBadge: false,
    }),
  });

  // Pedir permisos (locales)
  const { status } = await Notifications.requestPermissionsAsync();
  if (status !== 'granted') {
    console.warn('Notifications: permission not granted');
  }

  // Android: canal (requerido para mostrar notis)
  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.DEFAULT,
      vibrationPattern: [0, 250, 250, 250],
      lockscreenVisibility: Notifications.AndroidNotificationVisibility.PUBLIC,
    });
  }

  // Tap en la notificación → deep-link a /session/:id con query
  Notifications.addNotificationResponseReceivedListener((response) => {
    const data = response.notification.request.content.data as Partial<AcceptedPayload>;
    if (data?.type === 'accepted' && data.sessionId) {
      const q = new URLSearchParams({
        name: data.name ?? '',
        spec: data.spec ?? '',
        price: data.price != null ? String(data.price) : '',
      }).toString();
      router.push(`/session/${data.sessionId}?${q}`);
    }
  });
}

/**
 * Notificación "coach aceptó tu sesión".
 * En Expo Go NO usamos triggers programados → simulamos delay con setTimeout
 * y luego disparamos una notificación inmediata (trigger: null).
 */
export async function notifySessionAccepted(payload: AcceptedPayload, delayMs = 1500) {
  const fire = async () => {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: 'Coach aceptó tu sesión 🎉',
        body: `El coach ${payload.name} aceptó tu sesión.`,
        data: payload, // lo usa el listener para navegar
      },
      trigger: null, // inmediata (compatible con Expo Go)
    });
  };

  if (delayMs > 0) {
    setTimeout(fire, delayMs);
  } else {
    await fire();
  }
}
