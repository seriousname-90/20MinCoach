import { httpJson } from '@/src/services/http';

// PoC: ejemplo de uso (puedes apuntar luego a tu API real)
export async function fetchCoaches(params?: { q?: string }) {
  const query = params?.q ? `?q=${encodeURIComponent(params.q)}` : '';
  return httpJson<{ items: any[] }>(`https://api.tu-backend.com/coaches${query}`);
}
