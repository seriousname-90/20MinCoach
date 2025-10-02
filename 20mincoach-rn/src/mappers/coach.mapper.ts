// src/mappers/coach.mapper.ts
import { CoachDTO } from '@/src/dto/coach.dto';
import { Coach } from '@/src/models/Coach';
import { validateCoachDTO } from '@/src/validators/coach.validator';

// Import opcional de User (por si aún no existe o está fuera en este momento)
import type { User } from '@/src/models/User';
let UserCtor: { new(data: Partial<User>): User } | undefined;
try {
  UserCtor = require('@/src/models/User').User;
} catch {
  UserCtor = undefined;
}

export function toCoach(dto: CoachDTO): Coach {
  validateCoachDTO(dto);

  const maybeUser =
    UserCtor
      ? new (UserCtor as any)({
          id: dto.user?.id ?? dto.userId,
          name: dto.user?.name,
          email: dto.user?.email,
        })
      : undefined;

  return new Coach({
    id: dto.id,
    userId: dto.userId ?? dto.user?.id ?? '',
    user: maybeUser,
    bio: dto.bio ?? '',
    specialization: dto.specialization ?? [],
    hourlyRate: dto.hourlyRate ?? 0,
    rating: dto.rating ?? 0,
    totalSessions: dto.totalSessions ?? 0,
    yearsOfExperience: dto.yearsOfExperience ?? 0,
    certifications: dto.certifications ?? [],
    isVerified: dto.isVerified ?? false,
    availability: (dto.availability ?? []).map((d: any) =>
      d instanceof Date ? d : new Date(d)
    ),
  });
}
