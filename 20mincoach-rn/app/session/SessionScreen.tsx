// app/session/SessionScreen.tsx
import { View, Text, TouchableOpacity, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useState, useEffect } from 'react';

// Mock data de sesión activa
const SESSION_DATA = {
  'maria-garcia': {
    coachId: 'maria-garcia',
    coachName: 'María García',
    specialty: 'Psicología Clínica',
    price: 29.99,
    scheduledTime: '15:00 - 15:20'
  },
  'carlos-lopez': {
    coachId: 'carlos-lopez',
    coachName: 'Carlos López', 
    specialty: 'Mecánica Automotriz',
    price: 24.99,
    scheduledTime: '16:30 - 16:50'
  }
};

// Props para recibir los datos directamente
interface SessionScreenProps {
  coachId?: string;
  coachName?: string;
  specialty?: string;
  price?: number;
  onBack?: () => void; // ← AGREGAR ESTA PROP
}

export default function SessionScreen({ 
  coachId = 'maria-garcia', 
  coachName, 
  specialty, 
  price,
  onBack // ← RECIBIR LA PROP
}: SessionScreenProps) {
  const router = useRouter();
  const [timeLeft, setTimeLeft] = useState(20 * 60); // 20 minutos en segundos
  const [sessionActive, setSessionActive] = useState(true);
  const [sessionData, setSessionData] = useState<any>(null);
  const [isMuted, setIsMuted] = useState(false);
  const [isCameraOff, setIsCameraOff] = useState(false);

  useEffect(() => {
    // Cargar datos de la sesión - priorizar props, luego mock data
    if (coachName && specialty && price) {
      setSessionData({
        coachName,
        specialty,
        price,
        scheduledTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + ' - ' + 
          new Date(Date.now() + 20 * 60 * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      });
    } else if (coachId && SESSION_DATA[coachId as keyof typeof SESSION_DATA]) {
      setSessionData(SESSION_DATA[coachId as keyof typeof SESSION_DATA]);
    } else {
      setSessionData({
        coachName: 'Coach',
        specialty: 'Especialidad',
        price: 25.00,
        scheduledTime: 'Ahora - ' + new Date(Date.now() + 20 * 60 * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      });
    }
  }, [coachId, coachName, specialty, price]);

  // FUNCIÓN CORREGIDA PARA MANEJAR EL VOLVER
  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      // Verificar si podemos volver antes de intentarlo
      if (router.canGoBack && router.canGoBack()) {
        router.back();
      } else {
        // Si no hay pantalla anterior, ir a la pantalla principal
        router.replace('../(tabs)');
      }
    }
  };

  useEffect(() => {
    if (!sessionActive || !sessionData) return;

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          setSessionActive(false);
          Alert.alert(
            'Sesión Finalizada',
            'Tu sesión de 20 minutos ha concluido. ¡Esperamos que haya sido útil!',
            [
              {
                text: 'Calificar Coach',
                onPress: () => Alert.alert('Calificación', '¡Gracias por tu feedback!')
              },
              {
                text: 'Volver al Inicio',
                onPress: handleBack // ← USAR handleBack CORREGIDA
              }
            ]
          );
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [sessionActive, sessionData]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleEndSession = () => {
    Alert.alert(
      'Finalizar Sesión',
      '¿Estás seguro de que quieres finalizar la sesión antes de tiempo?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Finalizar', 
          onPress: () => {
            setSessionActive(false);
            Alert.alert('Sesión Finalizada', 'Has terminado la sesión anticipadamente.');
          }
        }
      ]
    );
  };

  const handleToggleMicrophone = () => {
    setIsMuted(!isMuted);
    Alert.alert('Micrófono', isMuted ? 'Micrófono activado' : 'Micrófono desactivado');
  };

  const handleToggleCamera = () => {
    setIsCameraOff(!isCameraOff);
    Alert.alert('Cámara', isCameraOff ? 'Cámara activada' : 'Cámara desactivada');
  };

  const handleRateSession = () => {
    Alert.alert(
      'Calificar Sesión',
      '¿Cómo calificarías esta sesión?',
      [
        { text: '⭐️⭐️⭐️⭐️⭐️ Excelente', onPress: () => Alert.alert('Gracias', '¡Gracias por tu calificación de 5 estrellas!') },
        { text: '⭐️⭐️⭐️⭐️ Muy buena', onPress: () => Alert.alert('Gracias', '¡Gracias por tu calificación de 4 estrellas!') },
        { text: '⭐️⭐️⭐️ Buena', onPress: () => Alert.alert('Gracias', '¡Gracias por tu calificación de 3 estrellas!') },
        { text: 'Cancelar', style: 'cancel' }
      ]
    );
  };

  if (!sessionData) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#1c1c1e' }}>
        <Text style={{ color: 'white', fontSize: 16 }}>Iniciando sesión...</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: '#1c1c1e' }}>
      {/* Header de información */}
      <View style={{ padding: 20, paddingTop: 50, alignItems: 'center' }}>
        <TouchableOpacity 
          onPress={handleBack}
          style={{ alignSelf: 'flex-start', marginBottom: 10 }}
        >
          <Text style={{ color: '#007AFF', fontSize: 16 }}>← Volver</Text>
        </TouchableOpacity>
        
        <Text style={{ color: 'white', fontSize: 20, fontWeight: 'bold', marginBottom: 5 }}>
          Sesión con {sessionData.coachName}
        </Text>
        <Text style={{ color: '#aaa', marginBottom: 10 }}>{sessionData.specialty}</Text>
        <Text style={{ color: '#34C759', fontWeight: '500' }}>
          ${sessionData.price} • {sessionData.scheduledTime}
        </Text>
      </View>

      {/* Área de video/llamada */}
      <View style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        margin: 20
      }}>
        {/* Placeholder del video del coach */}
        <View style={{
          width: '100%',
          height: 250,
          backgroundColor: '#333',
          borderRadius: 15,
          justifyContent: 'center',
          alignItems: 'center',
          marginBottom: 20,
          borderWidth: 2,
          borderColor: isCameraOff ? '#FF3B30' : '#34C759'
        }}>
          <Text style={{ color: 'white', fontSize: 18, marginBottom: 10 }}>
            🎥 {sessionData.coachName} {isCameraOff ? '(Cámara apagada)' : ''}
          </Text>
          <Text style={{ color: '#aaa' }}>
            {isMuted ? '🔇 Micrófono silenciado' : 'Sesión en progreso...'}
          </Text>
          <View style={{
            width: 100,
            height: 100,
            borderRadius: 50,
            backgroundColor: isCameraOff ? '#666' : '#444',
            justifyContent: 'center',
            alignItems: 'center',
            marginTop: 15
          }}>
            <Text style={{ color: 'white', fontSize: 36 }}>
              {sessionData.coachName.split(' ').map((n: string) => n[0]).join('')}
            </Text>
          </View>
        </View>

        {/* Timer principal */}
        <Text style={{ color: 'white', fontSize: 48, fontWeight: 'bold', marginBottom: 10 }}>
          {formatTime(timeLeft)}
        </Text>
        <Text style={{ color: '#aaa', marginBottom: 30 }}>
          Tiempo restante
        </Text>

        {/* Controles de sesión */}
        <View style={{ flexDirection: 'row', gap: 15, flexWrap: 'wrap', justifyContent: 'center' }}>
          <TouchableOpacity style={{
            backgroundColor: '#FF3B30',
            paddingHorizontal: 20,
            paddingVertical: 12,
            borderRadius: 10,
            minWidth: 100
          }} onPress={handleEndSession}>
            <Text style={{ color: 'white', fontWeight: 'bold', textAlign: 'center' }}>📞 Finalizar</Text>
          </TouchableOpacity>

          <TouchableOpacity style={{
            backgroundColor: isMuted ? '#666' : '#34C759',
            paddingHorizontal: 20,
            paddingVertical: 12,
            borderRadius: 10,
            minWidth: 100
          }} onPress={handleToggleMicrophone}>
            <Text style={{ color: 'white', fontWeight: 'bold', textAlign: 'center' }}>
              {isMuted ? '🔇' : '🎤'} {isMuted ? 'Activar' : 'Silenciar'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity style={{
            backgroundColor: isCameraOff ? '#666' : '#007AFF',
            paddingHorizontal: 20,
            paddingVertical: 12,
            borderRadius: 10,
            minWidth: 100
          }} onPress={handleToggleCamera}>
            <Text style={{ color: 'white', fontWeight: 'bold', textAlign: 'center' }}>
              {isCameraOff ? '📷' : '📹'} {isCameraOff ? 'Activar' : 'Apagar'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Barra inferior */}
      <View style={{ 
        padding: 15, 
        backgroundColor: '#2c2c2e',
        borderTopLeftRadius: 15,
        borderTopRightRadius: 15
      }}>
        <Text style={{ color: 'white', textAlign: 'center', fontSize: 12 }}>
          20minCoach • Sesión segura • Grabación no permitida
        </Text>
      </View>

      {/* Overlay cuando la sesión termina */}
      {!sessionActive && (
        <View style={{ 
          position: 'absolute', 
          top: 0, 
          left: 0, 
          right: 0, 
          bottom: 0, 
          backgroundColor: 'rgba(0,0,0,0.9)',
          justifyContent: 'center',
          alignItems: 'center',
          padding: 30
        }}>
          <Text style={{ color: 'white', fontSize: 24, fontWeight: 'bold', marginBottom: 10 }}>
            Sesión Finalizada
          </Text>
          <Text style={{ color: '#aaa', textAlign: 'center', marginBottom: 30, lineHeight: 20 }}>
            Tu sesión de 20 minutos con {sessionData.coachName} ha concluido.
          </Text>
          
          <TouchableOpacity 
            style={{
              backgroundColor: '#007AFF',
              paddingHorizontal: 30,
              paddingVertical: 15,
              borderRadius: 10,
              marginBottom: 15
            }}
            onPress={handleRateSession}
          >
            <Text style={{ color: 'white', fontWeight: 'bold' }}>⭐ Calificar Sesión</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={{
              backgroundColor: '#333',
              paddingHorizontal: 30,
              paddingVertical: 15,
              borderRadius: 10
            }}
            onPress={handleBack} // ← USAR handleBack CORREGIDA
          >
            <Text style={{ color: 'white' }}>Volver al Inicio</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}