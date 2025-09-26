// /src/test-utils/dto-test-utils.ts

export const createValidUserDTO = (overrides = {}) => ({
  id: '550e8400-e29b-41d4-a716-446655440000',
  email: 'test@example.com',
  first_name: 'John',
  last_name: 'Doe',
  phone: '+1234567890',
  avatar: 'https://example.com/avatar.jpg',
  role: 'STUDENT',
  is_active: true,
  last_login: '2024-01-15T10:00:00Z',
  created_at: '2024-01-01T00:00:00Z',
  updated_at: '2024-01-01T00:00:00Z',
  ...overrides
});

export const createInvalidUserDTO = (invalidFields: Record<string, any>) => {
  const validDTO = createValidUserDTO();
  return { ...validDTO, ...invalidFields };
};

export const expectValidationError = (operation: () => void, expectedField?: string) => {
  try {
    operation();
    fail('Expected ValidationError but none was thrown');
  } catch (error) {
    expect(error).toBeInstanceOf(Error);
    if (expectedField) {
      expect(error.message).toContain(expectedField);
    }
  }
};