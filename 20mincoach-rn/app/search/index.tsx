// app/search/index.tsx
import { useState, memo } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, ScrollView, Alert } from 'react-native';
import { notifySessionAccepted } from '@/src/services/notifications';

// === Mock data (simple) ===
const MOCK_COACHES = [
  { id: '1', name: 'María García', email: 'maria@email.com', specialties: ['Psicología','Salud Mental'], rating: 4.8, reviewCount: 124, hourlyRate: 29.99, isOnline: true,  categories: ['salud-mental'] },
  { id: '2', name: 'Carlos López', email: 'carlos@email.com', specialties: ['Mecánica Automotriz'], rating: 4.6, reviewCount: 89, hourlyRate: 24.99, isOnline: true,  categories: ['automotriz'] },
  { id: '3', name: 'Ana Martínez', email: 'ana@email.com', specialties: ['Derecho Laboral'], rating: 4.9, reviewCount: 156, hourlyRate: 34.99, isOnline: false, categories: ['legal'] },
];

const CATEGORIES = [
  { id: 'all', name: 'Todos' },
  { id: 'salud-mental', name: 'Salud Mental' },
  { id: 'automotriz', name: 'Automotriz' },
  { id: 'legal', name: 'Legal' },
];

// --- UI pequeñita separada para evitar rerenders ---
const SimpleCoachCard = memo(function SimpleCoachCard({
  coach, onPress,
}: { coach: any; onPress: () => void }) {
  return (
    <View style={{
      margin: 8, padding: 16, borderRadius: 8, backgroundColor: 'white',
      shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 3,
    }}>
      <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 4 }}>{coach.name}</Text>
      <Text style={{ fontWeight: '600', color: '#666', marginBottom: 4 }}>
        {coach.specialties.join(', ')}
      </Text>
      <Text style={{ color: '#FF9500', marginBottom: 4 }}>⭐ {coach.rating} ({coach.reviewCount} reviews)</Text>
      <Text style={{ fontWeight: 'bold', color: '#0066CC', marginBottom: 8 }}>${coach.hourlyRate}</Text>

      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
        <Text style={{ color: coach.isOnline ? '#34C759' : '#FF3B30', fontWeight: '500' }}>
          {coach.isOnline ? '✅ Disponible' : '⏳ No disponible'}
        </Text>

        <TouchableOpacity
          style={{
            backgroundColor: coach.isOnline ? '#007AFF' : '#ccc',
            paddingHorizontal: 16, paddingVertical: 8, borderRadius: 6,
          }}
          onPress={onPress}
          disabled={!coach.isOnline}
        >
          <Text style={{ color: 'white', fontWeight: '500' }}>Solicitar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
});

const SimpleSearchBar = memo(function SimpleSearchBar({
  searchText, setSearchText,
}: { searchText: string; setSearchText: (t: string) => void }) {
  return (
    <View style={{ flexDirection: 'row', marginBottom: 16 }}>
      <TextInput
        style={{ flex: 1, borderWidth: 1, borderColor: '#ddd', borderRadius: 8, padding: 12, marginRight: 10 }}
        placeholder="Buscar coaches..."
        value={searchText}
        onChangeText={setSearchText}
      />
      <TouchableOpacity style={{ backgroundColor: '#007AFF', padding: 12, borderRadius: 8, justifyContent: 'center' }}>
        <Text style={{ color: 'white' }}>🎤</Text>
      </TouchableOpacity>
    </View>
  );
});

export default function SearchScreen() {
  const [searchText, setSearchText] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const filteredCoaches = MOCK_COACHES.filter((coach) => {
    const bySearch =
      !searchText ||
      coach.name.toLowerCase().includes(searchText.toLowerCase()) ||
      coach.specialties.some((s: string) => s.toLowerCase().includes(searchText.toLowerCase()));
    const byCat = selectedCategory === 'all' || coach.categories.includes(selectedCategory);
    return bySearch && byCat;
  });

  // Para este PoC, cuando el usuario “solicite”, NO navegamos.
  // Disparamos una notificación “accepted” (simulada) y el deep-link nos lleva a /session/:id
  const request20min = (coach: any) => {
    Alert.alert(
      'Solicitar sesión',
      `¿Solicitar sesión de 20 minutos con ${coach.name} por $${coach.hourlyRate}?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Confirmar',
          onPress: async () => {
            await notifySessionAccepted({
              type: 'accepted',
              sessionId: coach.id,          // usamos el id como “id de sesión” fake
              name: coach.name,
              spec: coach.specialties?.[0],
              price: coach.hourlyRate,
            }, 1500);

            Alert.alert(
              'Solicitud enviada',
              'Te avisaremos cuando el coach acepte. Revisa la notificación y tócala para entrar a la sesión.'
            );
          },
        },
      ],
    );
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#f5f5f5' }}>
      {/* Header */}
      <View style={{ padding: 20, backgroundColor: 'white' }}>
        <Text style={{ fontSize: 28, fontWeight: 'bold', marginBottom: 16 }}>Encuentra tu Coach</Text>

        <SimpleSearchBar searchText={searchText} setSearchText={setSearchText} />

        {/* Filtros */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginTop: 16 }}>
          <View style={{ flexDirection: 'row', gap: 8 }}>
            {CATEGORIES.map((c) => (
              <TouchableOpacity
                key={c.id}
                style={{
                  backgroundColor: selectedCategory === c.id ? '#007AFF' : '#f0f0f0',
                  paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20,
                }}
                onPress={() => setSelectedCategory(c.id)}
              >
                <Text style={{ color: selectedCategory === c.id ? 'white' : '#333', fontWeight: '500' }}>
                  {c.name}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>

        <Text style={{ marginTop: 8, color: '#666' }}>{filteredCoaches.length} coaches encontrados</Text>
      </View>

      {/* Lista */}
      <FlatList
        data={filteredCoaches}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingBottom: 20 }}
        renderItem={({ item }) => (
          <SimpleCoachCard coach={item} onPress={() => request20min(item)} />
        )}
        ListEmptyComponent={
          <View style={{ padding: 40, alignItems: 'center' }}>
            <Text style={{ fontWeight: '600', marginBottom: 8 }}>No se encontraron coaches</Text>
            <Text style={{ color: '#666', textAlign: 'center' }}>Prueba con otros términos o categorías</Text>
          </View>
        }
      />
    </View>
  );
}
