// /src/models/Role.ts
export type Role = 'COACH' | 'STUDENT' | 'ADMIN' | 'MODERATOR';

export const RoleLabels: Record<Role, string> = {
  COACH: 'Coach',
  STUDENT: 'Student',
  ADMIN: 'Administrator',
  MODERATOR: 'Moderator',
};

export const RoleHierarchy: Record<Role, number> = {
  STUDENT: 1,
  COACH: 2,
  MODERATOR: 3,
  ADMIN: 4,
};

export class RoleHelper {
  static canManage(userRole: Role, targetRole: Role): boolean {
    return RoleHierarchy[userRole] >= RoleHierarchy[targetRole];
  }

  static isAtLeast(role: Role, minimumRole: Role): boolean {
    return RoleHierarchy[role] >= RoleHierarchy[minimumRole];
  }
}