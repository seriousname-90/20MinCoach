import { CoachDTO } from '@/src/dto/coach.dto';

export function validateCoachDTO(dto: any): asserts dto is CoachDTO {
  if (!dto || typeof dto !== 'object') throw new Error('CoachDTO: invalid object');
  const required = ['id','name','email','specialties','rating','reviewCount','hourlyRate','isOnline','categories'];
  for (const k of required) if (!(k in dto)) throw new Error(`CoachDTO: missing ${k}`);
  if (!Array.isArray(dto.specialties)) throw new Error('CoachDTO: specialties must be array');
  if (!Array.isArray(dto.categories)) throw new Error('CoachDTO: categories must be array');
}
