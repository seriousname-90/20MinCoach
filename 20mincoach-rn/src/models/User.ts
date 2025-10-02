// /src/models/User.ts
import { BaseModel } from './BaseModel';
import { Role } from '../validators/schemas';

export class User extends BaseModel {
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  avatar?: string;
  role: Role;
  isActive: boolean;
  lastLogin?: Date;

  constructor(data: Partial<User> = {}) {
    super(data);
    this.email = data.email || '';
    this.firstName = data.firstName || '';
    this.lastName = data.lastName || '';
    this.phone = data.phone;
    this.avatar = data.avatar;
    this.role = data.role || 'STUDENT';
    this.isActive = data.isActive ?? true;
    this.lastLogin = data.lastLogin ? new Date(data.lastLogin) : undefined;
  }

  get fullName(): string {
    return `${this.firstName} ${this.lastName}`;
  }

  toJSON() {
    return {
      ...super.toJSON(),
      email: this.email,
      firstName: this.firstName,
      lastName: this.lastName,
      phone: this.phone,
      avatar: this.avatar,
      role: this.role,
      isActive: this.isActive,
      lastLogin: this.lastLogin?.toISOString(),
    };
  }
}