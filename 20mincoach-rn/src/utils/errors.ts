// /src/utils/errors.ts

export abstract class BaseError extends Error {
  public readonly code: string;
  public readonly timestamp: Date;
  public readonly context?: Record<string, any>;

  constructor(
    code: string,
    message: string,
    context?: Record<string, any>
  ) {
    super(message);
    this.name = this.constructor.name;
    this.code = code;
    this.timestamp = new Date();
    this.context = context;
    
    // Maintains proper stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }
  }

  abstract toUI(): UIError;
}

// API Errors
export class ApiError extends BaseError {
  public readonly statusCode: number;
  public readonly url?: string;

  constructor(
    message: string,
    statusCode: number,
    url?: string,
    context?: Record<string, any>
  ) {
    super(`API_${statusCode}`, message, context);
    this.statusCode = statusCode;
    this.url = url;
  }

  toUI(): UIError {
    let userMessage: string;
    
    switch (this.statusCode) {
      case 400:
        userMessage = 'Invalid request. Please check your input.';
        break;
      case 401:
        userMessage = 'Please log in to continue.';
        break;
      case 403:
        userMessage = 'You do not have permission to perform this action.';
        break;
      case 404:
        userMessage = 'The requested resource was not found.';
        break;
      case 429:
        userMessage = 'Too many requests. Please try again later.';
        break;
      case 500:
        userMessage = 'Server error. Please try again later.';
        break;
      default:
        userMessage = 'An unexpected error occurred.';
    }

    return {
      code: this.code,
      message: userMessage,
      originalError: this.message,
      retryable: this.statusCode >= 500 || this.statusCode === 429
    };
  }
}

// Validation Errors
export class ValidationError extends BaseError {
  public readonly fieldErrors: Record<string, string[]>;

  constructor(fieldErrors: Record<string, string[]>, context?: Record<string, any>) {
    super('VALIDATION_ERROR', 'Validation failed', context);
    this.fieldErrors = fieldErrors;
  }

  toUI(): UIError {
    const firstError = Object.values(this.fieldErrors)[0]?.[0];
    
    return {
      code: this.code,
      message: firstError || 'Please check your input and try again.',
      originalError: this.message,
      fieldErrors: this.fieldErrors,
      retryable: false
    };
  }
}

// Network Errors
export class NetworkError extends BaseError {
  constructor(message: string, context?: Record<string, any>) {
    super('NETWORK_ERROR', message, context);
  }

  toUI(): UIError {
    return {
      code: this.code,
      message: 'Network connection failed. Please check your internet connection.',
      originalError: this.message,
      retryable: true
    };
  }
}

// Business Logic Errors
export class BusinessError extends BaseError {
  constructor(code: string, message: string, context?: Record<string, any>) {
    super(code, message, context);
  }

  toUI(): UIError {
    return {
      code: this.code,
      message: this.message, // Business errors often have user-friendly messages
      originalError: this.message,
      retryable: false
    };
  }
}

// UI Error Interface
export interface UIError {
  code: string;
  message: string;
  originalError?: string;
  fieldErrors?: Record<string, string[]>;
  retryable: boolean;
}

// Error factory helper
export class ErrorFactory {
  static fromUnknown(error: unknown): BaseError {
    if (error instanceof BaseError) {
      return error;
    }

    if (error instanceof Error) {
      // Handle specific native errors
      if (error.message.includes('Network request failed')) {
        return new NetworkError(error.message);
      }

      // Generic error wrapper
      return new BusinessError('UNKNOWN_ERROR', error.message);
    }

    return new BusinessError('UNKNOWN_ERROR', 'An unexpected error occurred');
  }
}