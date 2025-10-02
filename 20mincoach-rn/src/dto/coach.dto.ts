export interface CoachDTO {
  id: string;
  name: string;
  email: string;
  specialties: string[];
  rating: number;
  reviewCount: number;
  hourlyRate: number;
  isOnline: boolean;
  categories: string[];
}
