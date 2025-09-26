// components/RoleGate.tsx
import React from 'react';

export function RoleGate({
  roles,
  action,
  children,
}: {
  roles: string[];
  action: 'A' | 'B'; // A = Start 20-min, B = Earnings
  children: React.ReactNode;
}) {
  const canA = roles.includes('BasicUser') || roles.includes('PremiumUser');
  const canB = roles.includes('PremiumUser');
  const ok = action === 'A' ? canA : canB;
  return ok ? <>{children}</> : null;
}
