// /src/services/dto.ts

import { 
  User, 
  Coach, 
  SessionRequest, 
  Earning, 
  SessionStatus, 
  EarningStatus 
} from '../models';
import { 
  UserSchema, 
  CoachSchema, 
  SessionRequestSchema, 
  EarningSchema,
  CreateSessionRequestSchema,
  UpdateSessionRequestSchema,
  CreateCoachSchema,
  type User as UserType,
  type Coach as CoachType,
  type SessionRequest as SessionRequestType,
  type Earning as EarningType,
  type CreateSessionRequest as CreateSessionRequestType,
  type UpdateSessionRequest as UpdateSessionRequestType,
  type CreateCoach as CreateCoachType
} from '../validators/schemas';
import { ValidationHelper } from '../validators';
import { logger } from '../../utils/logger';
import { ValidationError, BusinessError } from '../../utils/errors';

// API Response Types
export interface ApiResponse<T> {
  data: T;
  message?: string;
  pagination?: {
    page: number;
    limit: number;
    total: number;
  };
}

export interface ApiErrorResponse {
  error: {
    code: string;
    message: string;
    details?: Record<string, any>;
  };
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// API DTOs (Data Transfer Objects)
export interface UserDTO {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  phone?: string;
  avatar?: string;
  role: string;
  is_active: boolean;
  last_login?: string;
  created_at: string;
  updated_at: string;
}

export interface CoachDTO {
  id: string;
  user_id: string;
  user?: UserDTO;
  bio: string;
  specialization: string[];
  hourly_rate: number;
  rating: number;
  total_sessions: number;
  years_of_experience: number;
  certifications: string[];
  is_verified: boolean;
  availability: string[];
  created_at: string;
  updated_at: string;
}

export interface SessionRequestDTO {
  id: string;
  student_id: string;
  coach_id: string;
  student?: UserDTO;
  coach?: CoachDTO;
  scheduled_for: string;
  duration: number;
  status: string;
  notes?: string;
  student_notes?: string;
  coach_notes?: string;
  price: number;
  meeting_url?: string;
  created_at: string;
  updated_at: string;
}

export interface EarningDTO {
  id: string;
  coach_id: string;
  session_request_id: string;
  coach?: CoachDTO;
  session_request?: SessionRequestDTO;
  amount: number;
  status: string;
  paid_at?: string;
  payment_method?: string;
  created_at: string;
  updated_at: string;
}

// Request DTOs for sending data to API
export interface CreateUserDTO {
  email: string;
  first_name: string;
  last_name: string;
  phone?: string;
  password: string;
  role: string;
}

export interface UpdateUserDTO {
  first_name?: string;
  last_name?: string;
  phone?: string;
  avatar?: string;
}

export interface CreateCoachDTO {
  user_id: string;
  bio: string;
  specialization: string[];
  hourly_rate: number;
  years_of_experience: number;
  certifications?: string[];
}

export interface UpdateCoachDTO {
  bio?: string;
  specialization?: string[];
  hourly_rate?: number;
  years_of_experience?: number;
  certifications?: string[];
  is_verified?: boolean;
}

// Transformers: API DTO → Model
export class DTOTransformer {
  private static transformDate(dateString: string | undefined): Date {
    if (!dateString) return new Date();
    
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      logger.warn('Invalid date string encountered, using current date', { dateString });
      return new Date();
    }
    return date;
  }

  private static safeParse<T>(
    schema: any, // Using any to avoid complex Zod type issues
    data: unknown, 
    operation: string,
    context?: Record<string, any>
  ): T {
    try {
      return ValidationHelper.validate(schema, data);
    } catch (error) {
      logger.error(`DTO transformation failed for ${operation}`, error as Error, {
        operation,
        context,
        inputData: this.sanitizeDataForLogging(data)
      });
      
      if (error instanceof Error) {
        throw new ValidationError(
          { [operation]: ['Data validation failed'] },
          { 
            operation, 
            context,
            validationError: error.message 
          }
        );
      }
      
      throw new BusinessError(
        'DTO_TRANSFORMATION_FAILED',
        `Failed to transform data for ${operation}`,
        { operation, context }
      );
    }
  }

  private static sanitizeDataForLogging(data: unknown): unknown {
    if (typeof data !== 'object' || data === null) return data;

    const sensitiveFields = ['password', 'token', 'authorization', 'credit_card', 'ssn'];
    const sanitized = JSON.parse(JSON.stringify(data));

    const sanitizeObject = (obj: Record<string, any>) => {
      for (const key in obj) {
        if (sensitiveFields.some(field => key.toLowerCase().includes(field))) {
          obj[key] = '***REDACTED***';
        } else if (typeof obj[key] === 'object' && obj[key] !== null) {
          sanitizeObject(obj[key]);
        }
      }
    };

    sanitizeObject(sanitized);
    return sanitized;
  }

  static toUser(dto: UserDTO): User {
    logger.debug('Transforming UserDTO to User model', { userId: dto.id });

    const validated = this.safeParse<UserType>(
      UserSchema,
      {
        id: dto.id,
        email: dto.email,
        firstName: dto.first_name,
        lastName: dto.last_name,
        phone: dto.phone,
        avatar: dto.avatar,
        role: dto.role,
        isActive: dto.is_active,
        lastLogin: dto.last_login ? this.transformDate(dto.last_login) : undefined,
        createdAt: this.transformDate(dto.created_at),
        updatedAt: this.transformDate(dto.updated_at),
      },
      'toUser',
      { userId: dto.id, email: dto.email }
    );

    const user = new User(validated);
    logger.debug('Successfully transformed UserDTO to User model', { userId: user.id });
    return user;
  }

  static toCoach(dto: CoachDTO): Coach {
    logger.debug('Transforming CoachDTO to Coach model', { coachId: dto.id, userId: dto.user_id });

    const validated = this.safeParse<CoachType>(
      CoachSchema,
      {
        id: dto.id,
        userId: dto.user_id,
        user: dto.user ? this.toUser(dto.user) : undefined,
        bio: dto.bio,
        specialization: dto.specialization,
        hourlyRate: dto.hourly_rate,
        rating: dto.rating,
        totalSessions: dto.total_sessions,
        yearsOfExperience: dto.years_of_experience,
        certifications: dto.certifications,
        isVerified: dto.is_verified,
        availability: dto.availability.map(dateStr => this.transformDate(dateStr)),
        createdAt: this.transformDate(dto.created_at),
        updatedAt: this.transformDate(dto.updated_at),
      },
      'toCoach',
      { coachId: dto.id, userId: dto.user_id }
    );

    const coach = new Coach(validated);
    logger.debug('Successfully transformed CoachDTO to Coach model', { coachId: coach.id });
    return coach;
  }

  static toSessionRequest(dto: SessionRequestDTO): SessionRequest {
    logger.debug('Transforming SessionRequestDTO to SessionRequest model', { sessionId: dto.id });

    const validated = this.safeParse<SessionRequestType>(
      SessionRequestSchema,
      {
        id: dto.id,
        studentId: dto.student_id,
        coachId: dto.coach_id,
        student: dto.student ? this.toUser(dto.student) : undefined,
        coach: dto.coach ? this.toCoach(dto.coach) : undefined,
        scheduledFor: this.transformDate(dto.scheduled_for),
        duration: dto.duration,
        status: dto.status as SessionStatus,
        notes: dto.notes,
        studentNotes: dto.student_notes,
        coachNotes: dto.coach_notes,
        price: dto.price,
        meetingUrl: dto.meeting_url,
        createdAt: this.transformDate(dto.created_at),
        updatedAt: this.transformDate(dto.updated_at),
      },
      'toSessionRequest',
      { sessionId: dto.id, studentId: dto.student_id, coachId: dto.coach_id }
    );

    const sessionRequest = new SessionRequest(validated);
    logger.debug('Successfully transformed SessionRequestDTO to SessionRequest model', { 
      sessionId: sessionRequest.id 
    });
    return sessionRequest;
  }

  static toEarning(dto: EarningDTO): Earning {
    logger.debug('Transforming EarningDTO to Earning model', { earningId: dto.id });

    const validated = this.safeParse<EarningType>(
      EarningSchema,
      {
        id: dto.id,
        coachId: dto.coach_id,
        sessionRequestId: dto.session_request_id,
        coach: dto.coach ? this.toCoach(dto.coach) : undefined,
        sessionRequest: dto.session_request ? this.toSessionRequest(dto.session_request) : undefined,
        amount: dto.amount,
        status: dto.status as EarningStatus,
        paidAt: dto.paid_at ? this.transformDate(dto.paid_at) : undefined,
        paymentMethod: dto.payment_method,
        createdAt: this.transformDate(dto.created_at),
        updatedAt: this.transformDate(dto.updated_at),
      },
      'toEarning',
      { earningId: dto.id, coachId: dto.coach_id }
    );

    const earning = new Earning(validated);
    logger.debug('Successfully transformed EarningDTO to Earning model', { earningId: earning.id });
    return earning;
  }

  // Batch transformations for arrays
  static toUserList(dtos: UserDTO[]): User[] {
    logger.debug('Transforming UserDTO array to User model array', { count: dtos.length });
    
    return dtos.map(dto => this.toUser(dto));
  }

  static toCoachList(dtos: CoachDTO[]): Coach[] {
    logger.debug('Transforming CoachDTO array to Coach model array', { count: dtos.length });
    
    return dtos.map(dto => this.toCoach(dto));
  }

  static toSessionRequestList(dtos: SessionRequestDTO[]): SessionRequest[] {
    logger.debug('Transforming SessionRequestDTO array to SessionRequest model array', { 
      count: dtos.length 
    });
    
    return dtos.map(dto => this.toSessionRequest(dto));
  }

  static toEarningList(dtos: EarningDTO[]): Earning[] {
    logger.debug('Transforming EarningDTO array to Earning model array', { count: dtos.length });
    
    return dtos.map(dto => this.toEarning(dto));
  }

  // Transformers: Model → API DTO
  static fromUser(user: User): UserDTO {
    logger.debug('Transforming User model to UserDTO', { userId: user.id });

    return {
      id: user.id,
      email: user.email,
      first_name: user.firstName,
      last_name: user.lastName,
      phone: user.phone,
      avatar: user.avatar,
      role: user.role,
      is_active: user.isActive,
      last_login: user.lastLogin?.toISOString(),
      created_at: user.createdAt.toISOString(),
      updated_at: user.updatedAt.toISOString(),
    };
  }

  static fromCoach(coach: Coach): CoachDTO {
    logger.debug('Transforming Coach model to CoachDTO', { coachId: coach.id });

    return {
      id: coach.id,
      user_id: coach.userId,
      user: coach.user ? this.fromUser(coach.user) : undefined,
      bio: coach.bio,
      specialization: coach.specialization,
      hourly_rate: coach.hourlyRate,
      rating: coach.rating,
      total_sessions: coach.totalSessions,
      years_of_experience: coach.yearsOfExperience,
      certifications: coach.certifications,
      is_verified: coach.isVerified,
      availability: coach.availability.map(date => date.toISOString()),
      created_at: coach.createdAt.toISOString(),
      updated_at: coach.updatedAt.toISOString(),
    };
  }

  static fromSessionRequest(sessionRequest: SessionRequest): SessionRequestDTO {
    logger.debug('Transforming SessionRequest model to SessionRequestDTO', { 
      sessionId: sessionRequest.id 
    });

    return {
      id: sessionRequest.id,
      student_id: sessionRequest.studentId,
      coach_id: sessionRequest.coachId,
      student: sessionRequest.student ? this.fromUser(sessionRequest.student) : undefined,
      coach: sessionRequest.coach ? this.fromCoach(sessionRequest.coach) : undefined,
      scheduled_for: sessionRequest.scheduledFor.toISOString(),
      duration: sessionRequest.duration,
      status: sessionRequest.status,
      notes: sessionRequest.notes,
      student_notes: sessionRequest.studentNotes,
      coach_notes: sessionRequest.coachNotes,
      price: sessionRequest.price,
      meeting_url: sessionRequest.meetingUrl,
      created_at: sessionRequest.createdAt.toISOString(),
      updated_at: sessionRequest.updatedAt.toISOString(),
    };
  }

  static fromEarning(earning: Earning): EarningDTO {
    logger.debug('Transforming Earning model to EarningDTO', { earningId: earning.id });

    return {
      id: earning.id,
      coach_id: earning.coachId,
      session_request_id: earning.sessionRequestId,
      coach: earning.coach ? this.fromCoach(earning.coach) : undefined,
      session_request: earning.sessionRequest ? this.fromSessionRequest(earning.sessionRequest) : undefined,
      amount: earning.amount,
      status: earning.status,
      paid_at: earning.paidAt?.toISOString(),
      payment_method: earning.paymentMethod,
      created_at: earning.createdAt.toISOString(),
      updated_at: earning.updatedAt.toISOString(),
    };
  }

  // Request validation and transformation
  static fromCreateSessionRequest(data: unknown): CreateSessionRequestType {
    logger.debug('Validating CreateSessionRequest data', {
      data: this.sanitizeDataForLogging(data)
    });

    return this.safeParse<CreateSessionRequestType>(
      CreateSessionRequestSchema,
      data,
      'fromCreateSessionRequest'
    );
  }

  static fromUpdateSessionRequest(data: unknown): UpdateSessionRequestType {
    logger.debug('Validating UpdateSessionRequest data', {
      data: this.sanitizeDataForLogging(data)
    });

    return this.safeParse<UpdateSessionRequestType>(
      UpdateSessionRequestSchema,
      data,
      'fromUpdateSessionRequest'
    );
  }

  static fromCreateCoach(data: unknown): CreateCoachType {
    logger.debug('Validating CreateCoach data', {
      data: this.sanitizeDataForLogging(data)
    });

    return this.safeParse<CreateCoachType>(
      CreateCoachSchema,
      data,
      'fromCreateCoach'
    );
  }

  // Paginated response transformation
  static toPaginatedResponse<T, U>(
    response: PaginatedResponse<T>,
    transformer: (item: T) => U
  ): PaginatedResponse<U> {
    return {
      data: response.data.map(transformer),
      pagination: response.pagination
    };
  }

  // Partial transformations for updates
  static fromPartialUserUpdate(updates: Partial<User>): Partial<UpdateUserDTO> {
    const dto: Partial<UpdateUserDTO> = {};

    if (updates.firstName !== undefined) dto.first_name = updates.firstName;
    if (updates.lastName !== undefined) dto.last_name = updates.lastName;
    if (updates.phone !== undefined) dto.phone = updates.phone;
    if (updates.avatar !== undefined) dto.avatar = updates.avatar;

    return dto;
  }

  static fromPartialCoachUpdate(updates: Partial<Coach>): Partial<UpdateCoachDTO> {
    const dto: Partial<UpdateCoachDTO> = {};

    if (updates.bio !== undefined) dto.bio = updates.bio;
    if (updates.specialization !== undefined) dto.specialization = updates.specialization;
    if (updates.hourlyRate !== undefined) dto.hourly_rate = updates.hourlyRate;
    if (updates.yearsOfExperience !== undefined) dto.years_of_experience = updates.yearsOfExperience;
    if (updates.certifications !== undefined) dto.certifications = updates.certifications;
    if (updates.isVerified !== undefined) dto.is_verified = updates.isVerified;

    return dto;
  }
}

// Response wrapper for consistent API responses
export class DTOResponse<T> {
  public readonly success: boolean;
  public readonly data?: T;
  public readonly error?: string;
  public readonly validationErrors?: Record<string, string[]>;

  private constructor(
    success: boolean, 
    data?: T, 
    error?: string, 
    validationErrors?: Record<string, string[]>
  ) {
    this.success = success;
    this.data = data;
    this.error = error;
    this.validationErrors = validationErrors;
  }

  static success<T>(data: T): DTOResponse<T> {
    return new DTOResponse(true, data);
  }

  static error<T>(error: string, validationErrors?: Record<string, string[]>): DTOResponse<T> {
    return new DTOResponse(false, undefined, error, validationErrors);
  }

  static fromPromise<T>(promise: Promise<T>): Promise<DTOResponse<T>> {
    return promise
      .then(data => DTOResponse.success(data))
      .catch(error => {
        if (error instanceof ValidationError) {
          return DTOResponse.error<T>(error.message, error.fieldErrors);
        }
        return DTOResponse.error<T>(error.message);
      });
  }
}

// Utility functions for common transformations
export const DTOUtils = {
  // Safe transformation with error handling
  safeTransform<T, U>(
    input: T, 
    transformer: (input: T) => U,
    context?: string
  ): DTOResponse<U> {
    try {
      const result = transformer(input);
      return DTOResponse.success(result);
    } catch (error) {
      logger.error(`Safe transformation failed${context ? ` for ${context}` : ''}`, error as Error, {
        context,
        input: DTOTransformer.sanitizeDataForLogging(input)
      });
      
      return DTOResponse.error(
        error instanceof Error ? error.message : 'Transformation failed',
        error instanceof ValidationError ? error.fieldErrors : undefined
      );
    }
  },

  // Batch transformation with individual error handling
  batchTransform<T, U>(
    items: T[],
    transformer: (item: T) => U,
    context?: string
  ): { successes: U[]; failures: { item: T; error: string }[] } {
    const successes: U[] = [];
    const failures: { item: T; error: string }[] = [];

    items.forEach(item => {
      try {
        const result = transformer(item);
        successes.push(result);
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Transformation failed';
        failures.push({ item, error: errorMessage });
        
        logger.warn(`Batch transformation failed for item`, {
          context,
          error: errorMessage,
          item: DTOTransformer.sanitizeDataForLogging(item)
        });
      }
    });

    if (failures.length > 0) {
      logger.warn(`Batch transformation completed with ${failures.length} failures`, {
        context,
        totalItems: items.length,
        successful: successes.length,
        failed: failures.length
      });
    }

    return { successes, failures };
  }
};