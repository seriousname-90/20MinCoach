// jest.config.js
module.exports = {
  preset: 'react-native',         // 👈 preset estable
  testEnvironment: 'jsdom',
  testMatch: ['<rootDir>/src/tests/**/*.test.(ts|tsx)'],
  setupFilesAfterEnv: ['<rootDir>/src/tests/jest.setup.ts'],
  moduleNameMapper: {
    '^expo-router$': '<rootDir>/src/tests/__mocks__/expo-router.tsx',
    '^@/(.*)$': '<rootDir>/$1',
    '\\.(png|jpg|jpeg|gif|svg)$': '<rootDir>/src/tests/__mocks__/fileMock.js',
  },
  transformIgnorePatterns: [
    'node_modules/(?!(jest-)?react-native|@react-native|@react-navigation|expo(nent)?|@expo(nent)?|expo-router|@expo/vector-icons|react-clone-referenced-element|react-native-svg)',
  ],
};
