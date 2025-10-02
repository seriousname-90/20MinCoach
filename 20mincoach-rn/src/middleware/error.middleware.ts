// /src/middleware/error.middleware.ts

import { BaseError, UIError, ErrorFactory, ApiError, ValidationError } from '../utils/errors';
import { logger } from '../utils/logger';

export interface ErrorHandlerConfig {
  showTechnicalErrors?: boolean; // For development
  onError?: (error: UIError) => void; // Callback for custom handling
}

export class ErrorHandler {
  private config: ErrorHandlerConfig;

  constructor(config: ErrorHandlerConfig = {}) {
    this.config = {
      showTechnicalErrors: __DEV__,
      ...config
    };
  }

  // Main error handling method
  handleError(error: unknown): UIError {
    const baseError = ErrorFactory.fromUnknown(error);
    const uiError = baseError.toUI();

    // Log the error
    this.logError(baseError, uiError);

    // Execute custom handler if provided
    if (this.config.onError) {
      this.config.onError(uiError);
    }

    // Return UI-friendly error
    return this.config.showTechnicalErrors 
      ? { ...uiError, technical: baseError.message }
      : uiError;
  }

  private logError(baseError: BaseError, uiError: UIError): void {
    const logMeta = {
      code: baseError.code,
      context: baseError.context,
      uiMessage: uiError.message,
      timestamp: baseError.timestamp.toISOString()
    };

    if (baseError instanceof ApiError) {
      logger.error(`API Error: ${baseError.message}`, baseError, logMeta);
    } else if (baseError instanceof ValidationError) {
      logger.warn(`Validation Error: ${baseError.message}`, logMeta);
    } else if (baseError instanceof NetworkError) {
      logger.error(`Network Error: ${baseError.message}`, baseError, logMeta);
    } else {
      logger.error(`Application Error: ${baseError.message}`, baseError, logMeta);
    }
  }

  // Specific handler for API errors
  handleApiError(error: any, url?: string): UIError {
    if (error?.response?.status) {
      const apiError = new ApiError(
        error.response.data?.message || error.message,
        error.response.status,
        url,
        { responseData: error.response.data }
      );
      return this.handleError(apiError);
    }

    return this.handleError(error);
  }

  // Specific handler for validation errors
  handleValidationError(fieldErrors: Record<string, string[]>): UIError {
    const validationError = new ValidationError(fieldErrors);
    return this.handleError(validationError);
  }
}

// Global error handler instance
export const globalErrorHandler = new ErrorHandler();

// React Hook for error handling
import { useState, useCallback } from 'react';

export const useErrorHandler = () => {
  const [error, setError] = useState<UIError | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const executeWithErrorHandling = useCallback(
    async <T>(operation: () => Promise<T>, onSuccess?: (result: T) => void): Promise<T | null> => {
      setIsLoading(true);
      setError(null);

      try {
        const result = await operation();
        onSuccess?.(result);
        return result;
      } catch (err) {
        const uiError = globalErrorHandler.handleError(err);
        setError(uiError);
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  const clearError = useCallback(() => setError(null), []);

  return {
    error,
    isLoading,
    executeWithErrorHandling,
    clearError
  };
};