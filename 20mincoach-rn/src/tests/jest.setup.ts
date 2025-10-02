import '@testing-library/jest-native/extend-expect';

// Mock Reanimated recomendado
jest.mock('react-native-reanimated', () => require('react-native-reanimated/mock'));

// Evitar registro nativo de RNGH en Jest
jest.mock('react-native-gesture-handler', () => {
  const Actual = jest.requireActual('react-native-gesture-handler');
  return { ...Actual, GestureHandlerRootView: ({ children }: any) => children };
});
