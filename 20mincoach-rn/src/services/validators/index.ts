// /src/validators/index.ts
export * from './schemas';

// Validation helper functions
import { z } from 'zod';

export class ValidationHelper {
  static validate<T>(schema: z.ZodSchema<T>, data: unknown): T {
    try {
      return schema.parse(data);
    } catch (error) {
      if (error instanceof z.ZodError) {
        const errors = error.errors.map(err => ({
          path: err.path.join('.'),
          message: err.message,
        }));
        throw new Error(`Validation failed: ${JSON.stringify(errors)}`);
      }
      throw error;
    }
  }

  static safeParse<T>(schema: z.ZodSchema<T>, data: unknown): { success: boolean; data?: T; error?: string } {
    try {
      const result = schema.parse(data);
      return { success: true, data: result };
    } catch (error) {
      if (error instanceof z.ZodError) {
        return { success: false, error: error.errors[0]?.message };
      }
      return { success: false, error: 'Unknown validation error' };
    }
  }

  // Common validation patterns
  static readonly patterns = {
    email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    phone: /^\+?[\d\s-()]{10,}$/,
    url: /^https?:\/\/.+/,
  };
}