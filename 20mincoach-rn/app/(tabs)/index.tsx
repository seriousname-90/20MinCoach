import { ScrollView, View, StyleSheet, Button } from 'react-native';
import { Card, Text } from 'react-native-paper';

export default function HomeScreen() {
  return (
    <ScrollView style={styles.container}>
      {/* PRUEBA REACT NATIVE PAPER */}
      <View style={styles.testContainer}>
        <Card>
          <Card.Content>
            <Text style={styles.title}>🧪 20minCoach</Text>
            <Text style={styles.body}>React Native Paper + React Navigation</Text>
            <Button 
              title="Probar Integración"
              onPress={() => alert('✅ ¡Funciona!')} 
            />
          </Card.Content>
        </Card>
      </View>

      <View style={styles.section}>
        <Text style={styles.subtitle}>Bienvenido</Text>
        <Text style={styles.body}>Esta es tu app 20minCoach funcionando con React Native Paper.</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  testContainer: {
    marginBottom: 20,
  },
  section: {
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  subtitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  body: {
    fontSize: 16,
  },
});