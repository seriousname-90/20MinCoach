import { CoachDTO } from '@/src/dto/coach.dto';
import type { Coach } from '@/src/models/coach';
import { validateCoachDTO } from '@/src/validators/coach.validator';

export function toCoach(dto: CoachDTO): Coach {
  validateCoachDTO(dto);
  // Devuelve un objeto plano que cumple la interfaz Coach
  return {
    id: dto.id,
    name: dto.name,
    email: dto.email,
    specialties: dto.specialties,
    rating: dto.rating,
    reviewCount: dto.reviewCount,
    hourlyRate: dto.hourlyRate,
    isOnline: dto.isOnline,
    categories: dto.categories,
  };
}
