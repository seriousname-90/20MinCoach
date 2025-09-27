// app/coach/CoachProfile.tsx
import { View, Text, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import type { RootState } from '@/src/store';
import { RoleGate } from '@/components/RoleGate';

// Mock data detallado de coaches
const COACH_DETAILS = {
  '1': {
    id: '1',
    name: 'María García',
    email: 'maria@email.com',
    specialties: ['Psicología Clínica', 'Salud Mental'],
    rating: 4.4, 
    reviewCount: 124,
    hourlyRate: 29.99,
    isOnline: true,
    description: 'Especialista en terapia cognitivo-conductual con 10 años de experiencia ayudando a personas con ansiedad y estrés laboral.',
    education: 'PhD en Psicología - Universidad Nacional',
    experience: '10 años de experiencia clínica',
    languages: ['Español', 'Inglés'],
    specialtiesList: ['Ansiedad', 'Estrés laboral', 'Relaciones interpersonales'],
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=200'
  },
  '2': {
    id: '2',
    name: 'Carlos López',
    email: 'carlos@email.com',
    specialties: ['Mecánica Automotriz'],
    rating: 4.6,
    reviewCount: 89,
    hourlyRate: 24.99,
    isOnline: true,
    description: 'Mecánico certificado con 15 años de experiencia en diagnóstico y reparación de vehículos.',
    education: 'Técnico en Mecánica Automotriz - Instituto Tecnológico',
    experience: '15 años en taller propio',
    languages: ['Español'],
    specialtiesList: ['Diagnóstico de motores', 'Sistemas eléctricos', 'Frenos'],
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200'
  },
  '3': {
    id: '3',
    name: 'Ana Martínez',
    email: 'ana@email.com',
    specialties: ['Derecho Laboral'],
    rating: 4.9,
    reviewCount: 156,
    hourlyRate: 34.99,
    isOnline: false,
    description: 'Abogada laboral con 8 años de experiencia en defensa de derechos workers.',
    education: 'Licenciada en Derecho - Universidad Autónoma',
    experience: '8 años en bufete especializado',
    languages: ['Español', 'Francés'],
    specialtiesList: ['Contratos laborales', 'Despidos injustificados'],
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200'
  }
};

// Props para recibir el coachId directamente
interface CoachProfileProps {
  coachId?: string;
  onBack?: () => void;
  onStartSession?: (coach: any) => void; // Nueva prop para manejar sesiones
}

export default function CoachProfile({ coachId, onBack, onStartSession }: CoachProfileProps) {
  const router = useRouter();
  const [coach, setCoach] = useState<any>(null);
  
  // Obtener roles del store de Redux
  const { roles } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    // Cargar datos del coach basado en el coachId prop
    if (coachId && COACH_DETAILS[coachId as keyof typeof COACH_DETAILS]) {
      setCoach(COACH_DETAILS[coachId as keyof typeof COACH_DETAILS]);
    }
  }, [coachId]);

  // Función para manejar el retroceso
  const handleBack = () => {
  if (onBack) {
    onBack();
  } else {
    // Verificar si hay pantallas en la pila de navegación
    if (router.canGoBack()) {
      router.back();
    } else {
      // Si no hay pantalla anterior, navegar a la pantalla principal
      router.push('/(tabs)');
    }
  }
};

  const handleSessionRequest = () => {
    Alert.alert(
      'Solicitar Sesión',
      `¿Confirmar sesión de 20 minutos con ${coach.name} por $${coach.hourlyRate}?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Confirmar', 
          onPress: () => {
            Alert.alert('Éxito', 'Sesión solicitada. El coach será notificado.');
            
            // Usar onStartSession si está disponible, de lo contrario navegar
            if (onStartSession) {
              onStartSession(coach);
            } else {
              // Navegación alternativa si no hay prop
              setTimeout(() => {
                // Intentar navegar a la pantalla de sesión
                if (router) {
                  router.push('../session');
                }
              }, 1500);
            }
          }
        }
      ]
    );
  };

  const handlePremiumAction = () => {
    Alert.alert(
      'Dashboard Premium',
      'Accediendo a estadísticas de ganancias...',
      [{ text: 'OK' }]
    );
  };

  const handleUpgradeToPremium = () => {
    Alert.alert(
      'Actualizar a Premium',
      '¿Deseas actualizar tu cuenta a Premium por $59.99/mes?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Actualizar', 
          onPress: () => Alert.alert('Éxito', '¡Bienvenido a Premium!') 
        }
      ]
    );
  };
  
  if (!coach) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f5f5f5' }}>
        <Text style={{ fontSize: 16, color: '#666' }}>Cargando perfil del coach...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={{ flex: 1, backgroundColor: '#f5f5f5' }}>
      {/* Header */}
      <View style={{ backgroundColor: 'white', padding: 20 }}>
        <TouchableOpacity onPress={handleBack}>
          <Text style={{ color: '#007AFF', fontSize: 16, marginBottom: 15 }}>← Volver</Text>
        </TouchableOpacity>
        
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <View style={{
            width: 80,
            height: 80,
            borderRadius: 40,
            backgroundColor: '#007AFF',
            justifyContent: 'center',
            alignItems: 'center',
            marginRight: 15
          }}>
            <Text style={{ color: 'white', fontSize: 24, fontWeight: 'bold' }}>
              {coach.name.split(' ').map((n: string) => n[0]).join('')}
            </Text>
          </View>
          
          <View style={{ flex: 1 }}>
            <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 4 }}>{coach.name}</Text>
            <Text style={{ fontSize: 16, color: '#666', marginBottom: 8 }}>{coach.specialties.join(', ')}</Text>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Text style={{ color: '#FF9500', fontWeight: '500' }}>⭐ {coach.rating} ({coach.reviewCount} reviews)</Text>
              <Text style={{ marginLeft: 15, fontWeight: 'bold', color: '#007AFF', fontSize: 18 }}>
                ${coach.hourlyRate}/hora
              </Text>
            </View>
          </View>
        </View>
      </View>

      {/* Información detallada */}
      <View style={{ backgroundColor: 'white', marginTop: 10, padding: 20 }}>
        <Text style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 15 }}>Sobre mí</Text>
        <Text style={{ color: '#666', lineHeight: 22, marginBottom: 20 }}>{coach.description}</Text>

        <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 10 }}>⚡ Especialidades</Text>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginBottom: 20 }}>
          {coach.specialtiesList.map((specialty: string, index: number) => (
            <View key={index} style={{ 
              backgroundColor: '#f0f8ff', 
              paddingHorizontal: 12, 
              paddingVertical: 6, 
              borderRadius: 15, 
              marginRight: 8, 
              marginBottom: 8 
            }}>
              <Text style={{ color: '#007AFF', fontWeight: '500' }}>{specialty}</Text>
            </View>
          ))}
        </View>

        <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 8 }}>🎓 Educación</Text>
        <Text style={{ color: '#666', marginBottom: 15 }}>{coach.education}</Text>

        <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 8 }}>💼 Experiencia</Text>
        <Text style={{ color: '#666', marginBottom: 15 }}>{coach.experience}</Text>

        <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 8 }}>🌐 Idiomas</Text>
        <Text style={{ color: '#666' }}>{coach.languages.join(', ')}</Text>
      </View>

      {/* Botones de acción con RoleGate */}
      <View style={{ padding: 20 }}>
        {/* Action A - Disponible para BasicUser y PremiumUser */}
        <RoleGate roles={roles} action="A">
          <TouchableOpacity 
            style={{
              backgroundColor: coach.isOnline ? '#007AFF' : '#ccc',
              padding: 18,
              borderRadius: 10,
              alignItems: 'center',
              marginBottom: 12,
            }}
            onPress={handleSessionRequest}
            disabled={!coach.isOnline}
          >
            <Text style={{ color: 'white', fontSize: 18, fontWeight: 'bold' }}>
              {coach.isOnline ? '🎥 Solicitar Sesión de 20 min' : '⏳ No disponible'}
            </Text>
            <Text style={{ color: 'white', marginTop: 4 }}>${coach.hourlyRate} • 20 minutos</Text>
          </TouchableOpacity>
        </RoleGate>

        {/* Action B - Solo para PremiumUser */}
        <RoleGate roles={roles} action="B">
          <TouchableOpacity 
            style={{
              backgroundColor: '#34C759',
              padding: 15,
              borderRadius: 10,
              alignItems: 'center',
              marginBottom: 12,
            }}
            onPress={handlePremiumAction}
          >
            <Text style={{ color: 'white', fontSize: 16, fontWeight: 'bold' }}>💰 Dashboard Premium</Text>
            <Text style={{ color: 'white', fontSize: 12, marginTop: 2 }}>Acceso a estadísticas avanzadas</Text>
          </TouchableOpacity>
        </RoleGate>

        {/* Botón para actualizar a Premium (visible para BasicUser) */}
        {roles.includes('BasicUser') && (
          <TouchableOpacity 
            style={{
              backgroundColor: '#ffd700',
              padding: 15,
              borderRadius: 10,
              alignItems: 'center',
            }}
            onPress={handleUpgradeToPremium}
          >
            <Text style={{ color: '#333', fontSize: 16, fontWeight: 'bold' }}>⭐ Actualizar a Premium</Text>
            <Text style={{ color: '#666', fontSize: 12, marginTop: 2 }}>Desbloquea funciones premium</Text>
          </TouchableOpacity>
        )}

        {/* Estado de disponibilidad */}
        <View style={{ 
          flexDirection: 'row', 
          alignItems: 'center', 
          justifyContent: 'center', 
          marginTop: 15,
          padding: 10,
          backgroundColor: coach.isOnline ? '#f0fff0' : '#fff0f0',
          borderRadius: 8
        }}>
          <Text style={{ color: coach.isOnline ? '#34C759' : '#FF3B30', fontWeight: '500' }}>
            {coach.isOnline ? '✅ Disponible para sesiones ahora' : '⏳ No disponible en este momento'}
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}