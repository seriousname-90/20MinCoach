// /src/models/BaseModel.ts
export abstract class BaseModel {
  id: string;
  createdAt: Date;
  updatedAt: Date;

  constructor(data: Partial<BaseModel> = {}) {
    this.id = data.id || '';
    this.createdAt = data.createdAt ? new Date(data.createdAt) : new Date();
    this.updatedAt = data.updatedAt ? new Date(data.updatedAt) : new Date();
  }

  toJSON(): Record<string, any> {
    return {
      id: this.id,
      createdAt: this.createdAt.toISOString(),
      updatedAt: this.updatedAt.toISOString(),
    };
  }
}