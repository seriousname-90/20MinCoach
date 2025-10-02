import React from 'react';
import { Redirect, type Href } from 'expo-router';

export type Role = 'BasicUser' | 'PremiumUser';

export const can = {
  // Action A: Start 20-min (Basic o Premium)
  A: (roles: string[]) => roles.includes('BasicUser') || roles.includes('PremiumUser'),
  // Action B: Earnings (solo Premium)
  B: (roles: string[]) => roles.includes('PremiumUser'),
};

/** Requiere sesión; si no hay, redirige a /auth */
export function RequireAuth({
  isAuthed,
  children,
}: {
  isAuthed: boolean;
  children: React.ReactNode;
}) {
  if (!isAuthed) return <Redirect href={'/auth' as Href} />;
  return <>{children}</>;
}

/** Requiere rol/es; si no cumple, redirige (por defecto a /dashboard/basic) */
export function RequireRole({
  roles,
  allowed,
  fallbackHref = '/dashboard/basic' as Href,
  children,
}: {
  roles: string[];
  allowed: (roles: string[]) => boolean;
  fallbackHref?: Href;
  children: React.ReactNode;
}) {
  if (!allowed(roles)) return <Redirect href={fallbackHref} />;
  return <>{children}</>;
}

/** Muestra/oculta un fragmento por acción (A/B) */
export function RoleGate({
  roles,
  action,
  children,
}: {
  roles: string[];
  action: 'A' | 'B';
  children: React.ReactNode;
}) {
  const ok = action === 'A' ? can.A(roles) : can.B(roles);
  if (!ok) return null;
  return <>{children}</>;
}
