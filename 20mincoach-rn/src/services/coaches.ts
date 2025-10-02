import { httpJson } from '@/src/services/http';
import { CoachDTO } from '@/src/dto/coach.dto';

export async function fetchCoaches(params?: { q?: string; category?: string }) {
  const qs = new URLSearchParams();
  if (params?.q) qs.set('q', params.q);
  if (params?.category) qs.set('category', params.category);
  const url = `https://api.tu-backend.com/coaches${qs.toString() ? `?${qs}` : ''}`;
  return httpJson<{ items: CoachDTO[] }>(url);
}
