import { useState } from 'react'; // ← AGREGAR ESTE IMPORT
import { Searchbar } from 'react-native-paper';
import { useWindowDimensions } from 'react-native';

export function SearchBar() {
  const { width } = useWindowDimensions();
  const [searchQuery, setSearchQuery] = useState('');
  
  // Responsive: tamaño diferente en móvil vs tablet
  const isMobile = width < 768;
  
  return (
    <Searchbar
      placeholder="Buscar coach..."
      onChangeText={setSearchQuery}
      value={searchQuery}
      style={{
        width: isMobile ? '100%' : 400, // Responsive
        marginHorizontal: isMobile ? 16 : 'auto',
      }}
    />
  );
}