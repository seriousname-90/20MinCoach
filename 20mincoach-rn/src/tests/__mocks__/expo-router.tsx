// src/tests/__mocks__/expo-router.tsx
import React from 'react';
import { Text } from 'react-native';
import { jest } from '@jest/globals';          // 👈 importa jest

export const Redirect = ({ href }: any) => (
  <Text testID="redirect">REDIRECT:{typeof href === 'string' ? href : 'obj'}</Text>
);

export const router = {
  push: jest.fn(),
  replace: jest.fn(),
  back: jest.fn(),
};
