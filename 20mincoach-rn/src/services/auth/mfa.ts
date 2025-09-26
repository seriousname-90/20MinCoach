import { supabase } from '@/src/services/api/supabase';

export async function enrolTotp() {
  const { data, error } = await supabase.auth.mfa.enroll({ factorType: 'totp' });
  if (error) throw error;
  return { factorId: data.id, secret: data.totp?.secret as string | undefined };
}

export async function verifyEnrolTotp(factorId: string, code6: string) {
  const { data, error } = await supabase.auth.mfa.challengeAndVerify({ factorId, code: code6 });
  if (error) throw error;
  return data;
}

export async function listFactors() {
  const { data, error } = await supabase.auth.mfa.listFactors();
  if (error) throw error;
  return data.totp ?? [];
}

export async function challengeAndVerifyTotp(factorId: string, code6: string) {
  const { data, error } = await supabase.auth.mfa.challengeAndVerify({ factorId, code: code6 });
  if (error) throw error;
  return data;
}
