// src/services/auth/session.ts
import { supabase } from '@/src/services/api/supabase';

function getRolesFromUser(user: any): string[] {
  return (
    user?.app_metadata?.roles ??
    user?.raw_app_meta_data?.roles ??   // por si el dashboard lo guarda así
    []
  );
}

export async function fetchAuthSnapshot() {
  const { data } = await supabase.auth.getSession();
  const s = data.session;
  const user = s?.user as any;
  return {
    email: user?.email ?? null,
    roles: getRolesFromUser(user),
    accessToken: s?.access_token ?? null,
  };
}
