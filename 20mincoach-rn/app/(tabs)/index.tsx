// app/(tabs)/index.tsx - VERSIÓN CON LAS NUEVAS PANTALLAS
import { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  FlatList, 
  ScrollView, 
  Alert 
} from 'react-native';
import { useRouter } from 'expo-router';

// Importar nuestras nuevas pantallas
import CoachProfile from '../coach/CoachProfile';
import SessionScreen from '../session/SessionScreen';

// Mock data
const MOCK_COACHES = [
  {
    id: '1',
    name: 'María García',
    email: 'maria@email.com',
    specialties: ['Psicología', 'Salud Mental'],
    rating: 4.8,
    reviewCount: 124,
    hourlyRate: 29.99,
    isOnline: true,
    categories: ['salud-mental'],
    available: true,
    avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150'
  },
  {
    id: '2', 
    name: 'Carlos López',
    email: 'carlos@email.com',
    specialties: ['Mecánica Automotriz'],
    rating: 4.6,
    reviewCount: 89,
    hourlyRate: 24.99,
    isOnline: true,
    categories: ['automotriz'],
    available: true,
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150'
  },
  {
    id: '3',
    name: 'Ana Martínez',
    email: 'ana@email.com',
    specialties: ['Derecho Laboral'],
    rating: 4.9,
    reviewCount: 156,
    hourlyRate: 34.99,
    isOnline: false,
    categories: ['legal'],
    available: false,
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150'
  }
];

const CATEGORIES = [
  { id: 'all', name: 'Todos' },
  { id: 'salud-mental', name: 'Salud Mental' },
  { id: 'automotriz', name: 'Automotriz' },
  { id: 'legal', name: 'Legal' },
];

// Componente simplificado de tarjeta
function SimpleCoachCard({ coach, onPress }: { coach: any; onPress: () => void }) {
  return (
    <View style={{ 
      margin: 8, 
      padding: 16, 
      borderRadius: 8,
      backgroundColor: 'white',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3
    }}>
      <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 4 }}>
        {coach.name}
      </Text>
      <Text style={{ fontWeight: '600', color: '#666', marginBottom: 4 }}>
        {coach.specialties.join(', ')}
      </Text>
      <Text style={{ color: '#FF9500', marginBottom: 4 }}>
        ⭐ {coach.rating} ({coach.reviewCount} reviews)
      </Text>
      <Text style={{ fontWeight: 'bold', color: '#0066CC', marginBottom: 8 }}>
        ${coach.hourlyRate}
      </Text>
      
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
        <Text style={{ 
          color: coach.isOnline ? '#34C759' : '#FF3B30',
          fontWeight: '500'
        }}>
          {coach.isOnline ? '✅ Disponible' : '⏳ No disponible'}
        </Text>
        
        <TouchableOpacity 
          style={{
            backgroundColor: coach.isOnline ? '#007AFF' : '#ccc',
            paddingHorizontal: 16,
            paddingVertical: 8,
            borderRadius: 6
          }}
          onPress={onPress}
          disabled={!coach.isOnline}
        >
          <Text style={{ color: 'white', fontWeight: '500' }}>
            Solicitar
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

// SearchBar simplificado
function SimpleSearchBar({ searchText, setSearchText }: { searchText: string; setSearchText: (text: string) => void }) {
  return (
    <View style={{ flexDirection: 'row', marginBottom: 16 }}>
      <TextInput
        style={{
          flex: 1,
          borderWidth: 1,
          borderColor: '#ddd',
          borderRadius: 8,
          padding: 12,
          marginRight: 10
        }}
        placeholder="Buscar coaches..."
        value={searchText}
        onChangeText={setSearchText}
      />
      <TouchableOpacity style={{
        backgroundColor: '#007AFF',
        padding: 12,
        borderRadius: 8,
        justifyContent: 'center'
      }}>
        <Text style={{ color: 'white' }}>🎤</Text>
      </TouchableOpacity>
    </View>
  );
}

// Enum para las pantallas disponibles
type CurrentScreen = 'search' | 'coach' | 'session';

export default function MainScreen() {
  const [searchText, setSearchText] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [currentScreen, setCurrentScreen] = useState<CurrentScreen>('search');
  const [selectedCoach, setSelectedCoach] = useState<any>(null);
  const [sessionCoach, setSessionCoach] = useState<any>(null);
  const router = useRouter();

  const filteredCoaches = MOCK_COACHES.filter(coach => {
    const matchesSearch = searchText === '' || 
      coach.name.toLowerCase().includes(searchText.toLowerCase()) ||
      coach.specialties.some(spec => 
        spec.toLowerCase().includes(searchText.toLowerCase())
      );
    
    const matchesCategory = selectedCategory === 'all' || 
      coach.categories.includes(selectedCategory);
    
    return matchesSearch && matchesCategory;
  });

  const handleCoachPress = (coach: any) => {
    setSelectedCoach(coach);
    setCurrentScreen('coach');
  };

  const handleRequestPress = (coach: any) => {
    Alert.alert(
      'Solicitar sesión',
      `¿Solicitar sesión de 20 minutos con ${coach.name} por $${coach.hourlyRate}?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Confirmar', 
          onPress: () => {
            Alert.alert('Éxito', 'Sesión solicitada correctamente');
            setSessionCoach(coach);
            setCurrentScreen('session');
          }
        }
      ]
    );
  };

  const handleBackToSearch = () => {
    setCurrentScreen('search');
    setSelectedCoach(null);
    setSessionCoach(null);
  };

  // Renderizar la pantalla actual
  const renderCurrentScreen = () => {
    switch (currentScreen) {
      case 'coach':
        return (
          <CoachProfile 
            coachId={selectedCoach?.id}
          />
        );

      case 'session':
        return (
          <SessionScreen 
            coachId={sessionCoach?.id}
            coachName={sessionCoach?.name}
            specialty={sessionCoach?.specialties?.[0]}
            price={sessionCoach?.hourlyRate}
          />
        );

      case 'search':
      default:
        return (
          <View style={{ flex: 1, backgroundColor: '#f5f5f5' }}>
            {/* Header */}
            <View style={{ padding: 20, backgroundColor: 'white' }}>
              <Text style={{ fontSize: 28, fontWeight: 'bold', marginBottom: 16 }}>
                Encuentra tu Coach
              </Text>
              
              {/* SearchBar */}
              <SimpleSearchBar searchText={searchText} setSearchText={setSearchText} />
              
              {/* Filtros */}
              <ScrollView 
                horizontal 
                showsHorizontalScrollIndicator={false}
                style={{ marginTop: 16 }}
              >
                <View style={{ flexDirection: 'row', gap: 8 }}>
                  {CATEGORIES.map(category => (
                    <TouchableOpacity
                      key={category.id}
                      style={{
                        backgroundColor: selectedCategory === category.id ? '#007AFF' : '#f0f0f0',
                        paddingHorizontal: 16,
                        paddingVertical: 8,
                        borderRadius: 20
                      }}
                      onPress={() => setSelectedCategory(category.id)}
                    >
                      <Text style={{
                        color: selectedCategory === category.id ? 'white' : '#333',
                        fontWeight: '500'
                      }}>
                        {category.name}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </ScrollView>

              {/* Contador */}
              <Text style={{ marginTop: 8, color: '#666' }}>
                {filteredCoaches.length} coaches encontrados
              </Text>
            </View>

            {/* Lista de coaches */}
            <FlatList
              data={filteredCoaches}
              keyExtractor={(item) => item.id}
              contentContainerStyle={{ paddingBottom: 20 }}
              renderItem={({ item }) => (
                <TouchableOpacity onPress={() => handleCoachPress(item)}>
                  <SimpleCoachCard 
                    coach={item}
                    onPress={() => handleRequestPress(item)}
                  />
                </TouchableOpacity>
              )}
              ListEmptyComponent={
                <View style={{ padding: 40, alignItems: 'center' }}>
                  <Text style={{ fontWeight: '600', marginBottom: 8 }}>
                    No se encontraron coaches
                  </Text>
                  <Text style={{ color: '#666', textAlign: 'center' }}>
                    Prueba con otros términos de búsqueda o categorías
                  </Text>
                </View>
              }
            />
          </View>
        );
    }
  };

  return renderCurrentScreen();
}