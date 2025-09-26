import 'react-native-url-polyfill/auto';
import { createClient } from '@supabase/supabase-js';
import * as SecureStore from 'expo-secure-store';
import Constants from 'expo-constants';
import * as AuthSession from 'expo-auth-session';

const EXTRA = (Constants.expoConfig?.extra ?? {}) as any;
const SUPABASE_URL: string = EXTRA.SUPABASE_URL;
const SUPABASE_ANON_KEY: string = EXTRA.SUPABASE_ANON_KEY;

// Almacenamiento seguro
const secureStorage = {
  getItem: (key: string) => SecureStore.getItemAsync(key),
  setItem: (key: string, value: string) => SecureStore.setItemAsync(key, value),
  removeItem: (key: string) => SecureStore.deleteItemAsync(key),
};

export const redirectTo = AuthSession.makeRedirectUri({ useProxy: true } as any);
console.log('redirectTo ->', redirectTo);

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    storage: secureStorage as any,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    flowType: 'pkce', // necesario en Expo Go
  },
});