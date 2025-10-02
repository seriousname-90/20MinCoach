// /src/models/Coach.ts
import { BaseModel } from './BaseModel';
import { User } from './User';

export class Coach extends BaseModel {
  userId: string;
  user?: User; // Populated when joining with user data
  bio: string;
  specialization: string[];
  hourlyRate: number;
  rating: number;
  totalSessions: number;
  yearsOfExperience: number;
  certifications: string[];
  isVerified: boolean;
  availability: Date[];

  constructor(data: Partial<Coach> = {}) {
    super(data);
    this.userId = data.userId || '';
    this.user = data.user;
    this.bio = data.bio || '';
    this.specialization = data.specialization || [];
    this.hourlyRate = data.hourlyRate || 0;
    this.rating = data.rating || 0;
    this.totalSessions = data.totalSessions || 0;
    this.yearsOfExperience = data.yearsOfExperience || 0;
    this.certifications = data.certifications || [];
    this.isVerified = data.isVerified || false;
    this.availability = data.availability?.map(date => new Date(date)) || [];
  }

  get hourlyRateFormatted(): string {
    return `$${this.hourlyRate.toFixed(2)}/hr`;
  }

  get experienceLabel(): string {
    if (this.yearsOfExperience === 0) return 'Less than 1 year';
    if (this.yearsOfExperience === 1) return '1 year of experience';
    return `${this.yearsOfExperience} years of experience`;
  }

  toJSON() {
    return {
      ...super.toJSON(),
      userId: this.userId,
      user: this.user?.toJSON(),
      bio: this.bio,
      specialization: this.specialization,
      hourlyRate: this.hourlyRate,
      rating: this.rating,
      totalSessions: this.totalSessions,
      yearsOfExperience: this.yearsOfExperience,
      certifications: this.certifications,
      isVerified: this.isVerified,
      availability: this.availability.map(date => date.toISOString()),
    };
  }
}