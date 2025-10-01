import { supabase } from '@/src/services/api/supabase';

export async function signUpWithPassword(email: string, password: string) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });
  if (error) throw error;
  return data;
}

export async function signInWithPassword(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw error;
  return data;
}

export async function setPassword(password: string) {
  // requiere estar autenticado
  const { data, error } = await supabase.auth.updateUser({ password });
  if (error) throw error;
  return data;
}

export async function resetPasswordByEmail(email: string, redirectTo?: string) {
  const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo, // opcional: deep link de tu app si quieres manejar “recovery”
  });
  if (error) throw error;
  return data;
}

export async function signOut() {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}

export async function getSession() {
  const { data } = await supabase.auth.getSession();
  return data.session ?? null;
}

export async function getUser() {
  const { data } = await supabase.auth.getUser();
  return data.user ?? null;
}
