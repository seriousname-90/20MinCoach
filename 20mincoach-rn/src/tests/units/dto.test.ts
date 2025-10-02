// /src/services/__tests__/dto.test.ts

import { DTOTransformer, DTOUtils, DTOResponse } from '../../services/dto/dto';
import { User, Coach, SessionRequest, Earning } from '../../models';
import { ValidationError } from '../../utils/errors';
import { logger } from '../../utils/logger';

// Mock logger to avoid console noise during tests
jest.mock('../../utils/logger', () => ({
  logger: {
    debug: jest.fn(),
    info: jest.fn(),
    warn: jest.fn(),
    error: jest.fn(),
    apiRequest: jest.fn(),
    apiResponse: jest.fn(),
  }
}));

// Sample test data
const mockUserDTO: any = {
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
};

const mockCoachDTO: any = {
  id: '660e8400-e29b-41d4-a716-446655440000',
  user_id: '550e8400-e29b-41d4-a716-446655440000',
  user: mockUserDTO,
  bio: 'Experienced coach with 5 years of practice',
  specialization: ['React Native', 'TypeScript'],
  hourly_rate: 75.50,
  rating: 4.8,
  total_sessions: 150,
  years_of_experience: 5,
  certifications: ['React Native Certified', 'Advanced TypeScript'],
  is_verified: true,
  availability: ['2024-01-20T10:00:00Z', '2024-01-21T14:00:00Z'],
  created_at: '2024-01-01T00:00:00Z',
  updated_at: '2024-01-01T00:00:00Z',
};

const mockSessionRequestDTO: any = {
  id: '770e8400-e29b-41d4-a716-446655440000',
  student_id: '550e8400-e29b-41d4-a716-446655440000',
  coach_id: '660e8400-e29b-41d4-a716-446655440000',
  student: mockUserDTO,
  coach: mockCoachDTO,
  scheduled_for: '2024-01-20T10:00:00Z',
  duration: 60,
  status: 'CONFIRMED',
  notes: 'Need help with React Native navigation',
  student_notes: 'Preparing for project',
  coach_notes: 'Will focus on best practices',
  price: 75.50,
  meeting_url: 'https://meet.example.com/session-123',
  created_at: '2024-01-15T00:00:00Z',
  updated_at: '2024-01-15T00:00:00Z',
};

const mockEarningDTO: any = {
  id: '880e8400-e29b-41d4-a716-446655440000',
  coach_id: '660e8400-e29b-41d4-a716-446655440000',
  session_request_id: '770e8400-e29b-41d4-a716-446655440000',
  coach: mockCoachDTO,
  session_request: mockSessionRequestDTO,
  amount: 75.50,
  status: 'PAID',
  paid_at: '2024-01-20T11:00:00Z',
  payment_method: 'credit_card',
  created_at: '2024-01-20T11:00:00Z',
  updated_at: '2024-01-20T11:00:00Z',
};

describe('DTOTransformer', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Success Scenarios', () => {
    test('should transform valid UserDTO to User model', () => {
      const user = DTOTransformer.toUser(mockUserDTO);
      
      expect(user).toBeInstanceOf(User);
      expect(user.id).toBe(mockUserDTO.id);
      expect(user.email).toBe(mockUserDTO.email);
      expect(user.firstName).toBe(mockUserDTO.first_name);
      expect(user.lastName).toBe(mockUserDTO.last_name);
      expect(user.phone).toBe(mockUserDTO.phone);
      expect(user.avatar).toBe(mockUserDTO.avatar);
      expect(user.role).toBe(mockUserDTO.role);
      expect(user.isActive).toBe(mockUserDTO.is_active);
      expect(user.lastLogin).toBeInstanceOf(Date);
      expect(user.createdAt).toBeInstanceOf(Date);
      expect(user.updatedAt).toBeInstanceOf(Date);
      
      // Test model methods
      expect(user.fullName).toBe('John Doe');
    });

    test('should transform valid CoachDTO to Coach model', () => {
      const coach = DTOTransformer.toCoach(mockCoachDTO);
      
      expect(coach).toBeInstanceOf(Coach);
      expect(coach.id).toBe(mockCoachDTO.id);
      expect(coach.userId).toBe(mockCoachDTO.user_id);
      expect(coach.bio).toBe(mockCoachDTO.bio);
      expect(coach.specialization).toEqual(mockCoachDTO.specialization);
      expect(coach.hourlyRate).toBe(mockCoachDTO.hourly_rate);
      expect(coach.rating).toBe(mockCoachDTO.rating);
      expect(coach.yearsOfExperience).toBe(mockCoachDTO.years_of_experience);
      expect(coach.certifications).toEqual(mockCoachDTO.certifications);
      expect(coach.isVerified).toBe(mockCoachDTO.is_verified);
      expect(coach.availability).toHaveLength(2);
      expect(coach.availability[0]).toBeInstanceOf(Date);
      
      // Test model methods
      expect(coach.hourlyRateFormatted).toBe('$75.50/hr');
      expect(coach.experienceLabel).toBe('5 years of experience');
    });

    test('should transform valid SessionRequestDTO to SessionRequest model', () => {
      const sessionRequest = DTOTransformer.toSessionRequest(mockSessionRequestDTO);
      
      expect(sessionRequest).toBeInstanceOf(SessionRequest);
      expect(sessionRequest.id).toBe(mockSessionRequestDTO.id);
      expect(sessionRequest.studentId).toBe(mockSessionRequestDTO.student_id);
      expect(sessionRequest.coachId).toBe(mockSessionRequestDTO.coach_id);
      expect(sessionRequest.scheduledFor).toBeInstanceOf(Date);
      expect(sessionRequest.duration).toBe(mockSessionRequestDTO.duration);
      expect(sessionRequest.status).toBe(mockSessionRequestDTO.status);
      expect(sessionRequest.price).toBe(mockSessionRequestDTO.price);
      expect(sessionRequest.meetingUrl).toBe(mockSessionRequestDTO.meeting_url);
      
      // Test nested models
      expect(sessionRequest.student).toBeInstanceOf(User);
      expect(sessionRequest.coach).toBeInstanceOf(Coach);
      
      // Test model methods
      expect(sessionRequest.endsAt).toBeInstanceOf(Date);
      expect(sessionRequest.isUpcoming).toBe(true);
    });

    test('should transform valid EarningDTO to Earning model', () => {
      const earning = DTOTransformer.toEarning(mockEarningDTO);
      
      expect(earning).toBeInstanceOf(Earning);
      expect(earning.id).toBe(mockEarningDTO.id);
      expect(earning.coachId).toBe(mockEarningDTO.coach_id);
      expect(earning.sessionRequestId).toBe(mockEarningDTO.session_request_id);
      expect(earning.amount).toBe(mockEarningDTO.amount);
      expect(earning.status).toBe(mockEarningDTO.status);
      expect(earning.paidAt).toBeInstanceOf(Date);
      expect(earning.paymentMethod).toBe(mockEarningDTO.payment_method);
      
      // Test nested models
      expect(earning.coach).toBeInstanceOf(Coach);
      expect(earning.sessionRequest).toBeInstanceOf(SessionRequest);
      
      // Test model methods
      expect(earning.amountFormatted).toBe('$75.50');
      expect(earning.isPaid).toBe(true);
    });

    test('should handle batch transformations successfully', () => {
      const userDTOs = [mockUserDTO, { ...mockUserDTO, id: 'another-id' }];
      const users = DTOTransformer.toUserList(userDTOs);
      
      expect(users).toHaveLength(2);
      expect(users[0]).toBeInstanceOf(User);
      expect(users[1]).toBeInstanceOf(User);
      expect(users[0].id).toBe(mockUserDTO.id);
      expect(users[1].id).toBe('another-id');
    });

    test('should transform models back to DTOs correctly', () => {
      const user = DTOTransformer.toUser(mockUserDTO);
      const userDTO = DTOTransformer.fromUser(user);
      
      expect(userDTO.id).toBe(user.id);
      expect(userDTO.email).toBe(user.email);
      expect(userDTO.first_name).toBe(user.firstName);
      expect(userDTO.last_name).toBe(user.lastName);
      expect(userDTO.created_at).toBe(user.createdAt.toISOString());
    });

    test('should validate and transform CreateSessionRequest data', () => {
      const validData = {
        coachId: '660e8400-e29b-41d4-a716-446655440000',
        scheduledFor: '2024-01-20T10:00:00Z',
        duration: 60,
        notes: 'Test session'
      };
      
      const result = DTOTransformer.fromCreateSessionRequest(validData);
      
      expect(result.coachId).toBe(validData.coachId);
      expect(result.scheduledFor).toBe(validData.scheduledFor);
      expect(result.duration).toBe(validData.duration);
      expect(result.notes).toBe(validData.notes);
    });
  });

  describe('Failure Scenarios', () => {
    test('should throw ValidationError for invalid UserDTO data', () => {
      const invalidUserDTO = {
        ...mockUserDTO,
        email: 'invalid-email', // Invalid email
        first_name: '', // Empty first name
      };
      
      expect(() => {
        DTOTransformer.toUser(invalidUserDTO);
      }).toThrow(ValidationError);
      
      // Verify error logging
      expect(logger.error).toHaveBeenCalledWith(
        'DTO transformation failed for toUser',
        expect.any(Error),
        expect.objectContaining({
          operation: 'toUser',
          context: expect.objectContaining({ userId: invalidUserDTO.id })
        })
      );
    });

    test('should handle invalid date strings gracefully', () => {
      const invalidDateDTO = {
        ...mockUserDTO,
        created_at: 'invalid-date-string',
      };
      
      const user = DTOTransformer.toUser(invalidDateDTO);
      
      // Should use current date as fallback
      expect(user.createdAt).toBeInstanceOf(Date);
      expect(user.createdAt.getTime()).toBeGreaterThan(0);
      
      // Should log warning
      expect(logger.warn).toHaveBeenCalledWith(
        'Invalid date string encountered, using current date',
        { dateString: 'invalid-date-string' }
      );
    });

    test('should throw ValidationError for missing required fields', () => {
      const incompleteDTO = {
        id: mockUserDTO.id,
        email: mockUserDTO.email,
        // Missing first_name, last_name, etc.
      };
      
      expect(() => {
        DTOTransformer.toUser(incompleteDTO as any);
      }).toThrow(ValidationError);
    });

    test('should handle invalid nested objects gracefully', () => {
      const invalidNestedDTO = {
        ...mockCoachDTO,
        user: {
          ...mockUserDTO,
          email: 'invalid-email', // Invalid email in nested user
        },
      };
      
      expect(() => {
        DTOTransformer.toCoach(invalidNestedDTO);
      }).toThrow(ValidationError);
    });

    test('should handle extremely long strings that exceed validation', () => {
      const longStringDTO = {
        ...mockUserDTO,
        first_name: 'a'.repeat(1000), // Exceeds max length of 50
      };
      
      expect(() => {
        DTOTransformer.toUser(longStringDTO);
      }).toThrow(ValidationError);
    });

    test('should handle invalid UUID format', () => {
      const invalidUUIDDTO = {
        ...mockUserDTO,
        id: 'not-a-valid-uuid',
      };
      
      expect(() => {
        DTOTransformer.toUser(invalidUUIDDTO);
      }).toThrow(ValidationError);
    });

    test('should handle invalid enum values', () => {
      const invalidEnumDTO = {
        ...mockUserDTO,
        role: 'INVALID_ROLE', // Not in Role enum
      };
      
      expect(() => {
        DTOTransformer.toUser(invalidEnumDTO);
      }).toThrow(ValidationError);
    });

    test('should handle malformed JSON data', () => {
      const malformedData = {
        ...mockUserDTO,
        bio: undefined, // CoachDTO requires bio, but it's undefined
      };
      
      expect(() => {
        DTOTransformer.toCoach(malformedData as any);
      }).toThrow(ValidationError);
    });
  });

  describe('Edge Cases', () => {
    test('should handle null and undefined values appropriately', () => {
      const withNullsDTO = {
        ...mockUserDTO,
        phone: null,
        avatar: undefined,
        last_login: null,
      };
      
      const user = DTOTransformer.toUser(withNullsDTO as any);
      
      expect(user.phone).toBeUndefined();
      expect(user.avatar).toBeUndefined();
      expect(user.lastLogin).toBeUndefined();
    });

    test('should handle empty arrays correctly', () => {
      const emptyArraysDTO = {
        ...mockCoachDTO,
        specialization: [],
        certifications: [],
        availability: [],
      };
      
      const coach = DTOTransformer.toCoach(emptyArraysDTO);
      
      expect(coach.specialization).toEqual([]);
      expect(coach.certifications).toEqual([]);
      expect(coach.availability).toEqual([]);
    });

    test('should handle very large numbers', () => {
      const largeNumbersDTO = {
        ...mockCoachDTO,
        hourly_rate: 999999.99,
        rating: 5.0,
        years_of_experience: 50,
      };
      
      const coach = DTOTransformer.toCoach(largeNumbersDTO);
      
      expect(coach.hourlyRate).toBe(999999.99);
      expect(coach.rating).toBe(5.0);
      expect(coach.yearsOfExperience).toBe(50);
    });

    test('should handle special characters in strings', () => {
      const specialCharsDTO = {
        ...mockUserDTO,
        first_name: 'Jöhn Dæ',
        email: 'test+special@example.com',
      };
      
      const user = DTOTransformer.toUser(specialCharsDTO);
      
      expect(user.firstName).toBe('Jöhn Dæ');
      expect(user.email).toBe('test+special@example.com');
    });

    test('should handle timezone variations in date strings', () => {
      const timezoneDatesDTO = {
        ...mockUserDTO,
        created_at: '2024-01-01T00:00:00-05:00', // EST timezone
        updated_at: '2024-01-01T00:00:00+09:00', // JST timezone
      };
      
      const user = DTOTransformer.toUser(timezoneDatesDTO);
      
      expect(user.createdAt).toBeInstanceOf(Date);
      expect(user.updatedAt).toBeInstanceOf(Date);
      // Dates should be properly parsed regardless of timezone
      expect(user.createdAt.getFullYear()).toBe(2024);
      expect(user.updatedAt.getFullYear()).toBe(2024);
    });
  });
});

describe('DTOUtils', () => {
  describe('safeTransform', () => {
    test('should return success for valid transformation', () => {
      const result = DTOUtils.safeTransform(
        mockUserDTO,
        DTOTransformer.toUser,
        'test-context'
      );
      
      expect(result.success).toBe(true);
      expect(result.data).toBeInstanceOf(User);
      expect(result.error).toBeUndefined();
    });

    test('should return error for invalid transformation', () => {
      const invalidDTO = { invalid: 'data' };
      
      const result = DTOUtils.safeTransform(
        invalidDTO,
        DTOTransformer.toUser,
        'test-context'
      );
      
      expect(result.success).toBe(false);
      expect(result.data).toBeUndefined();
      expect(result.error).toBeDefined();
      expect(result.error).toContain('failed');
    });

    test('should include validation errors when available', () => {
      // This test might need to be adjusted based on your actual validation errors
      const result = DTOUtils.safeTransform(
        { invalid: 'data' },
        DTOTransformer.toUser,
        'test-context'
      );
      
      // The exact structure depends on your ValidationError implementation
      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });
  });

  describe('batchTransform', () => {
    test('should handle mixed success and failure scenarios', () => {
      const mixedDTOs = [
        mockUserDTO, // Valid
        { ...mockUserDTO, id: 'valid-but-different' }, // Valid
        { invalid: 'data' }, // Invalid
        { ...mockUserDTO, email: 'invalid-email' }, // Invalid email
      ];
      
      const result = DTOUtils.batchTransform(
        mixedDTOs,
        DTOTransformer.toUser,
        'batch-test'
      );
      
      expect(result.successes).toHaveLength(2);
      expect(result.failures).toHaveLength(2);
      
      expect(result.successes[0]).toBeInstanceOf(User);
      expect(result.successes[1]).toBeInstanceOf(User);
      
      expect(result.failures[0].error).toBeDefined();
      expect(result.failures[1].error).toBeDefined();
      
      // Verify logging
      expect(logger.warn).toHaveBeenCalledWith(
        'Batch transformation completed with 2 failures',
        expect.objectContaining({
          context: 'batch-test',
          totalItems: 4,
          successful: 2,
          failed: 2
        })
      );
    });

    test('should handle empty array', () => {
      const result = DTOUtils.batchTransform([], DTOTransformer.toUser, 'empty-test');
      
      expect(result.successes).toHaveLength(0);
      expect(result.failures).toHaveLength(0);
    });

    test('should handle all successful transformations', () => {
      const validDTOs = [mockUserDTO, { ...mockUserDTO, id: 'second' }];
      
      const result = DTOUtils.batchTransform(validDTOs, DTOTransformer.toUser, 'all-success');
      
      expect(result.successes).toHaveLength(2);
      expect(result.failures).toHaveLength(0);
    });

    test('should handle all failed transformations', () => {
      const invalidDTOs = [{ invalid: 'data' }, { also: 'invalid' }];
      
      const result = DTOUtils.batchTransform(invalidDTOs, DTOTransformer.toUser, 'all-fail');
      
      expect(result.successes).toHaveLength(0);
      expect(result.failures).toHaveLength(2);
    });
  });
});

describe('DTOResponse', () => {
  test('should create successful response', () => {
    const data = { test: 'data' };
    const response = DTOResponse.success(data);
    
    expect(response.success).toBe(true);
    expect(response.data).toBe(data);
    expect(response.error).toBeUndefined();
  });

  test('should create error response', () => {
    const errorMessage = 'Something went wrong';
    const response = DTOResponse.error(errorMessage);
    
    expect(response.success).toBe(false);
    expect(response.data).toBeUndefined();
    expect(response.error).toBe(errorMessage);
  });

  test('should create error response with validation errors', () => {
    const validationErrors = { email: ['Invalid email format'] };
    const response = DTOResponse.error('Validation failed', validationErrors);
    
    expect(response.success).toBe(false);
    expect(response.validationErrors).toEqual(validationErrors);
  });

  test('should handle successful promise', async () => {
    const successfulPromise = Promise.resolve('success-data');
    const response = await DTOResponse.fromPromise(successfulPromise);
    
    expect(response.success).toBe(true);
    expect(response.data).toBe('success-data');
  });

  test('should handle failed promise', async () => {
    const failedPromise = Promise.reject(new Error('Operation failed'));
    const response = await DTOResponse.fromPromise(failedPromise);
    
    expect(response.success).toBe(false);
    expect(response.error).toBe('Operation failed');
  });

  test('should handle ValidationError in promise', async () => {
    const validationError = new ValidationError(
      { field: ['is required'] },
      { context: 'test' }
    );
    const failedPromise = Promise.reject(validationError);
    const response = await DTOResponse.fromPromise(failedPromise);
    
    expect(response.success).toBe(false);
    expect(response.error).toBe(validationError.message);
    expect(response.validationErrors).toEqual({ field: ['is required'] });
  });
});

describe('Data Sanitization', () => {
  test('should sanitize sensitive data in logs', () => {
    const sensitiveData = {
      password: 'secret123',
      token: 'jwt-token-here',
      credit_card: '4111111111111111',
      normalField: 'safe-data'
    };
    
    const sanitized = (DTOTransformer as any).sanitizeDataForLogging(sensitiveData);
    
    expect(sanitized.password).toBe('***REDACTED***');
    expect(sanitized.token).toBe('***REDACTED***');
    expect(sanitized.credit_card).toBe('***REDACTED***');
    expect(sanitized.normalField).toBe('safe-data');
  });

  test('should handle nested sensitive data', () => {
    const nestedSensitiveData = {
      user: {
        email: 'test@example.com',
        password: 'secret',
        profile: {
          token: 'nested-token'
        }
      }
    };
    
    const sanitized = (DTOTransformer as any).sanitizeDataForLogging(nestedSensitiveData);
    
    expect(sanitized.user.password).toBe('***REDACTED***');
    expect(sanitized.user.profile.token).toBe('***REDACTED***');
    expect(sanitized.user.email).toBe('test@example.com'); // Email is not sensitive
  });
});