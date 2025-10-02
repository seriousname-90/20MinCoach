// /src/services/__tests__/dto-partial.test.ts

import { DTOTransformer } from '../../services/dto/dto';
import { User, Coach } from '../../models';

describe('DTOTransformer Partial Updates', () => {
  test('should create partial user update DTO correctly', () => {
    const userUpdates = {
      firstName: 'UpdatedFirstName',
      phone: '+9876543210',
      avatar: 'https://example.com/new-avatar.jpg'
    };
    
    const updateDTO = DTOTransformer.fromPartialUserUpdate(userUpdates);
    
    expect(updateDTO).toEqual({
      first_name: 'UpdatedFirstName',
      phone: '+9876543210',
      avatar: 'https://example.com/new-avatar.jpg'
    });
  });

  test('should handle empty partial user update', () => {
    const updateDTO = DTOTransformer.fromPartialUserUpdate({});
    
    expect(updateDTO).toEqual({});
  });

  test('should create partial coach update DTO correctly', () => {
    const coachUpdates = {
      bio: 'Updated bio with more experience',
      hourlyRate: 85.00,
      isVerified: true
    };
    
    const updateDTO = DTOTransformer.fromPartialCoachUpdate(coachUpdates);
    
    expect(updateDTO).toEqual({
      bio: 'Updated bio with more experience',
      hourly_rate: 85.00,
      is_verified: true
    });
  });

  test('should ignore undefined values in partial updates', () => {
    const userUpdates = {
      firstName: 'UpdatedName',
      lastName: undefined, // Should be ignored
      phone: '+1234567890'
    };
    
    const updateDTO = DTOTransformer.fromPartialUserUpdate(userUpdates);
    
    expect(updateDTO).toEqual({
      first_name: 'UpdatedName',
      phone: '+1234567890'
    });
    expect(updateDTO.last_name).toBeUndefined();
  });
});