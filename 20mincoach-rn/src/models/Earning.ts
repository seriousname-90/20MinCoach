// /src/models/Earning.ts
import { BaseModel } from './BaseModel';
import { Coach } from './Coach';
import { SessionRequest } from './SessionRequest';

export type EarningStatus = 'PENDING' | 'PAID' | 'CANCELLED';

export class Earning extends BaseModel {
  coachId: string;
  sessionRequestId: string;
  coach?: Coach;
  sessionRequest?: SessionRequest;
  amount: number;
  status: EarningStatus;
  paidAt?: Date;
  paymentMethod?: string;

  constructor(data: Partial<Earning> = {}) {
    super(data);
    this.coachId = data.coachId || '';
    this.sessionRequestId = data.sessionRequestId || '';
    this.coach = data.coach;
    this.sessionRequest = data.sessionRequest;
    this.amount = data.amount || 0;
    this.status = data.status || 'PENDING';
    this.paidAt = data.paidAt ? new Date(data.paidAt) : undefined;
    this.paymentMethod = data.paymentMethod;
  }

  get amountFormatted(): string {
    return `$${this.amount.toFixed(2)}`;
  }

  get isPaid(): boolean {
    return this.status === 'PAID';
  }

  get paymentDate(): string | undefined {
    return this.paidAt?.toLocaleDateString();
  }

  toJSON() {
    return {
      ...super.toJSON(),
      coachId: this.coachId,
      sessionRequestId: this.sessionRequestId,
      coach: this.coach?.toJSON(),
      sessionRequest: this.sessionRequest?.toJSON(),
      amount: this.amount,
      status: this.status,
      paidAt: this.paidAt?.toISOString(),
      paymentMethod: this.paymentMethod,
    };
  }
}