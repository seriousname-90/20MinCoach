// src/tests/auth.guard.test.tsx
import React from 'react';
import { Text } from 'react-native';
import { render, screen } from '@testing-library/react-native';
import { RoleGate, RequireRole, can } from '@/src/middleware/auth.guard';

describe('auth.guard (UI)', () => {
  test('RoleGate muestra acción A para BasicUser', () => {
    render(
      <RoleGate roles={['BasicUser']} action="A">
        <Text>ActionA</Text>
      </RoleGate>
    );
    expect(screen.getByText('ActionA')).toBeTruthy();
  });

  test('RoleGate oculta acción B para BasicUser', () => {
    const { queryByText } = render(
      <RoleGate roles={['BasicUser']} action="B">
        <Text>ActionB</Text>
      </RoleGate>
    );
    expect(queryByText('ActionB')).toBeNull();
  });

  test('RequireRole redirige si no tiene permiso', () => {
    render(
      <RequireRole roles={['BasicUser']} allowed={can.B} fallbackHref="/dashboard/basic">
        <Text>Secret</Text>
      </RequireRole>
    );
    const redirect = screen.getByTestId('redirect');
    expect(redirect).toHaveTextContent('REDIRECT:/dashboard/basic');
  });
});
