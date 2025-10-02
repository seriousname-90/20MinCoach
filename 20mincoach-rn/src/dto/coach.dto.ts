
export interface CoachDTO {
  id: string;

  // Nuevo esquema
  userId: string;
  user?: {
    id?: string;
    name?: string;
    email?: string;
    avatarUrl?: string | null;
  };

  bio: string;
  specialization: string[];
  hourlyRate: number;
  rating: number;
  totalSessions: number;
  yearsOfExperience: number;
  certifications: string[];
  isVerified: boolean;
  /** Fechas ISO; el mapper las convertirá a Date[] */
  availability: string[];

  // Legacy/fallback (opcional, para UI antigua):
  name?: string;        // fallback a user?.name
  email?: string;       // fallback a user?.email
  isOnline?: boolean;
  categories?: string[];
}
