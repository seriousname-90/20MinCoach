// /src/models/SessionRequest.ts
import { BaseModel } from './BaseModel';
import { User } from './User';
import { Coach } from './Coach';

export type SessionStatus = 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED' | 'REJECTED';

export class SessionRequest extends BaseModel {
  studentId: string;
  coachId: string;
  student?: User;
  coach?: Coach;
  scheduledFor: Date;
  duration: number; // in minutes
  status: SessionStatus;
  notes?: string;
  studentNotes?: string;
  coachNotes?: string;
  price: number;
  meetingUrl?: string;

  constructor(data: Partial<SessionRequest> = {}) {
    super(data);
    this.studentId = data.studentId || '';
    this.coachId = data.coachId || '';
    this.student = data.student;
    this.coach = data.coach;
    this.scheduledFor = data.scheduledFor ? new Date(data.scheduledFor) : new Date();
    this.duration = data.duration || 60;
    this.status = data.status || 'PENDING';
    this.notes = data.notes;
    this.studentNotes = data.studentNotes;
    this.coachNotes = data.coachNotes;
    this.price = data.price || 0;
    this.meetingUrl = data.meetingUrl;
  }

  get endsAt(): Date {
    return new Date(this.scheduledFor.getTime() + this.duration * 60000);
  }

  get isUpcoming(): boolean {
    const now = new Date();
    return this.scheduledFor > now && ['PENDING', 'CONFIRMED'].includes(this.status);
  }

  get isCompleted(): boolean {
    return this.status === 'COMPLETED';
  }

  get canBeCancelled(): boolean {
    const now = new Date();
    const hoursUntilSession = (this.scheduledFor.getTime() - now.getTime()) / (1000 * 60 * 60);
    return this.isUpcoming && hoursUntilSession > 24; // Can cancel up to 24 hours before
  }

  toJSON() {
    return {
      ...super.toJSON(),
      studentId: this.studentId,
      coachId: this.coachId,
      student: this.student?.toJSON(),
      coach: this.coach?.toJSON(),
      scheduledFor: this.scheduledFor.toISOString(),
      duration: this.duration,
      status: this.status,
      notes: this.notes,
      studentNotes: this.studentNotes,
      coachNotes: this.coachNotes,
      price: this.price,
      meetingUrl: this.meetingUrl,
    };
  }
}