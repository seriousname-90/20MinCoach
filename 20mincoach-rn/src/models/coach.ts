// src/models/coach.ts
export interface Coach {
  id: string;
  name: string;
  email: string;
  specialties: string[];
  rating: number;
  reviewCount: number;
  hourlyRate: number;
  avatar?: string;
  bio?: string;
  isOnline: boolean;
}