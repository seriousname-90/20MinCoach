import React, { useState } from 'react';
import { View, Text, TextInput, Button, FlatList } from 'react-native';
import { useSelector } from 'react-redux';
import type { RootState } from '@/src/store';
import { RequireAuth } from '@/src/middleware/auth.guard';
import { useQuery } from '@tanstack/react-query';
import { httpJson } from '@/src/services/http';

const BLUE = '#3B82F6';

async function fetchUsers() {
  // PoC: endpoint público; en real, cambia por tu API (usa httpJson => token + 401 handling)
  return httpJson<Array<{ id: number; name: string; email: string }>>(
    'https://jsonplaceholder.typicode.com/users'
  );
}

export default function DataTestScreen() {
  const { email } = useSelector((s: RootState) => s.auth);
  const [q, setQ] = useState('');
  const [submitted, setSubmitted] = useState(''); // para no refetchear en cada tipeo

  const { data, isFetching, refetch } = useQuery({
    queryKey: ['users', 'public'], // cache estable
    queryFn: fetchUsers,
    staleTime: 30_000,
  });

  const list = (data ?? []).filter(
    (u) =>
      !submitted ||
      u.name.toLowerCase().includes(submitted.toLowerCase()) ||
      u.email.toLowerCase().includes(submitted.toLowerCase())
  );

  return (
    <RequireAuth isAuthed={!!email}>
      <View style={{ flex: 1, padding: 16, gap: 12 }}>
        <Text style={{ fontSize: 18, fontWeight: '700', color: BLUE }}>
          Data Test (Query + httpJson)
        </Text>

        <TextInput
          value={q}
          onChangeText={setQ}
          placeholder="Buscar por nombre o email…"
          autoCapitalize="none"
          style={{
            borderWidth: 1,
            borderColor: BLUE,
            borderRadius: 8,
            padding: 10,
            color: BLUE,
            backgroundColor: 'transparent',
          }}
          cursorColor={BLUE}
          selectionColor={BLUE}
          placeholderTextColor={BLUE}
        />

        <View style={{ gap: 8 }}>
          <Button
            title={isFetching ? 'Buscando…' : 'Buscar'}
            onPress={async () => {
              setSubmitted(q);
              await refetch(); // refetch opcional; el filtro es local
            }}
          />
          <Button title="Refrescar datos desde red" onPress={() => refetch()} />
        </View>

        <FlatList
          data={list}
          keyExtractor={(item) => String(item.id)}
          ItemSeparatorComponent={() => <View style={{ height: 8 }} />}
          renderItem={({ item }) => (
            <View style={{ paddingVertical: 8 }}>
              <Text style={{ fontWeight: '600', color: BLUE }}>{item.name}</Text>
              <Text style={{ color: BLUE }}>{item.email}</Text>
            </View>
          )}
          ListEmptyComponent={
            !isFetching ? (
              <Text style={{ color: BLUE }}>
                {submitted ? 'Sin resultados' : 'Sin datos (toca Buscar)'}
              </Text>
            ) : null
          }
        />
      </View>
    </RequireAuth>
  );
}
