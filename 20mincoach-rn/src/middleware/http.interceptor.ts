import { supabase } from '@/src/services/api/supabase';

/** Callback global para 401 (se configura una vez en _layout) */
let onUnauthorized: (() => void) | null = null;
export function setOnUnauthorized(cb: (() => void) | null) {
  onUnauthorized = cb;
}

/**
 * Interceptor: inyecta Authorization y maneja 401.
 * Úsalo en tus servicios en lugar de fetch().
 */
export async function withAuth(input: RequestInfo | URL, init: RequestInit = {}) {
  // token actual
  const { data } = await supabase.auth.getSession();
  const token = data.session?.access_token;

  const headers: HeadersInit = {
    Accept: 'application/json',
    ...(init.headers || {}),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };

  const res = await fetch(input, { ...init, headers });

  if (res.status === 401) {
    // corta sesión local y notifica
    try {
      await supabase.auth.signOut();
    } catch {}
    onUnauthorized?.();
  }

  return res;
}
