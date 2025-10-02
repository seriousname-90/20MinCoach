// src/services/realtime.ts

type PresenceEvent = {
  coachId: string;
  available: boolean;
};

type SessionEvent = {
  coachId: string;
  coachName: string;
  status: 'pending' | 'accepted';
};

export const subscribePresence = (callback: (event: PresenceEvent) => void) => {
  console.log('🔄 Simulador de presencia iniciado');

  const interval = setInterval(() => {
    const event: PresenceEvent = {
      coachId: Math.random().toString(36).substring(7),
      available: Math.random() > 0.5,
    };
    callback(event);
  }, 4000); // cada 4s

  // retorna función para limpiar
  return () => clearInterval(interval);
};

export const subscribeSession = (callback: (event: SessionEvent) => void) => {
  console.log('🔄 Simulador de sesión iniciado');

  const interval = setInterval(() => {
    const event: SessionEvent = {
      coachId: 'coach-123',
      coachName: 'Alex',
      status: Math.random() > 0.7 ? 'accepted' : 'pending', // a veces "acepta"
    };
    callback(event);
  }, 6000); // cada 6s

  return () => clearInterval(interval);
};
