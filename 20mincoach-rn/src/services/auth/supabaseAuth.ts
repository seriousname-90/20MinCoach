import { supabase } from '@/src/services/api/supabase';

export async function requestEmailOtp(email: string) {
  const { data, error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      shouldCreateUser: true, // crea el user si no existe
      // sin redirect: usamos código
    },
  });
  if (error) throw error;
  return data;
}

export async function verifyEmailOtp(email: string, code: string) {
  // 1) Intento como OTP de email (sign-in)
  let { data, error } = await supabase.auth.verifyOtp({
    email,
    token: code,
    type: 'email',
  });

  // 2) Si falla (p.ej. flujo de confirmación de signup), probamos como 'signup'
  if (error) {
    const res2 = await supabase.auth.verifyOtp({
      email,
      token: code,
      type: 'signup',
    });
    if (res2.error) throw res2.error;
    return res2.data;
  }

  return data;
}

export async function getSession() {
  const { data } = await supabase.auth.getSession();
  return data.session ?? null;
}

export async function getUser() {
  const { data } = await supabase.auth.getUser();
  return data.user ?? null;
}

export async function signOut() {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}
