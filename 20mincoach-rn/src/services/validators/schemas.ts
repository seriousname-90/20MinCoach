// /src/validators/schemas.ts
import { z } from 'zod';

// Base schemas for common fields
export const BaseSchema = z.object({
  id: z.string().uuid(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

export const PaginationSchema = z.object({
  page: z.number().int().positive().default(1),
  limit: z.number().int().positive().max(100).default(20),
  total: z.number().int().nonnegative().optional(),
});

// Role Schema
export const RoleSchema = z.enum(['COACH', 'STUDENT', 'ADMIN', 'MODERATOR']);

// User Schema
export const UserSchema = BaseSchema.extend({
  email: z.string().email(),
  firstName: z.string().min(1).max(50),
  lastName: z.string().min(1).max(50),
  phone: z.string().optional(),
  avatar: z.string().url().optional().nullable(),
  role: RoleSchema,
  isActive: z.boolean().default(true),
  lastLogin: z.string().datetime().optional().nullable(),
});

// Coach Schema
export const CoachSchema = BaseSchema.extend({
  userId: z.string().uuid(),
  bio: z.string().min(10).max(1000),
  specialization: z.array(z.string().min(1)).min(1),
  hourlyRate: z.number().positive(),
  rating: z.number().min(0).max(5).default(0),
  totalSessions: z.number().int().nonnegative().default(0),
  yearsOfExperience: z.number().int().nonnegative(),
  certifications: z.array(z.string()).default([]),
  isVerified: z.boolean().default(false),
  availability: z.array(z.string().datetime()).default([]),
});

// SessionRequest Schema
export const SessionRequestSchema = BaseSchema.extend({
  studentId: z.string().uuid(),
  coachId: z.string().uuid(),
  scheduledFor: z.string().datetime(),
  duration: z.number().int().positive().default(60), // in minutes
  status: z.enum(['PENDING', 'CONFIRMED', 'CANCELLED', 'COMPLETED', 'REJECTED']),
  notes: z.string().max(500).optional(),
  studentNotes: z.string().max(500).optional(),
  coachNotes: z.string().max(500).optional(),
  price: z.number().positive(),
  meetingUrl: z.string().url().optional().nullable(),
});

// Earning Schema
export const EarningSchema = BaseSchema.extend({
  coachId: z.string().uuid(),
  sessionRequestId: z.string().uuid(),
  amount: z.number().positive(),
  status: z.enum(['PENDING', 'PAID', 'CANCELLED']),
  paidAt: z.string().datetime().optional().nullable(),
  paymentMethod: z.string().optional(),
});

// API Request/Response Schemas
export const CreateSessionRequestSchema = SessionRequestSchema.pick({
  coachId: true,
  scheduledFor: true,
  duration: true,
  notes: true,
}).extend({
  studentId: z.string().uuid().optional(), // Can be inferred from auth
});

export const UpdateSessionRequestSchema = SessionRequestSchema.pick({
  status: true,
  coachNotes: true,
}).partial();

export const CreateCoachSchema = CoachSchema.pick({
  bio: true,
  specialization: true,
  hourlyRate: true,
  yearsOfExperience: true,
  certifications: true,
}).extend({
  userId: z.string().uuid().optional(), // Can be inferred from auth
});

// Export types
export type Role = z.infer<typeof RoleSchema>;
export type User = z.infer<typeof UserSchema>;
export type Coach = z.infer<typeof CoachSchema>;
export type SessionRequest = z.infer<typeof SessionRequestSchema>;
export type Earning = z.infer<typeof EarningSchema>;
export type CreateSessionRequest = z.infer<typeof CreateSessionRequestSchema>;
export type UpdateSessionRequest = z.infer<typeof UpdateSessionRequestSchema>;
export type CreateCoach = z.infer<typeof CreateCoachSchema>;