// src/services/http.ts
import { withAuth } from '@/src/middleware/http.interceptor';

export async function httpJson<T = any>(url: string, init: RequestInit = {}) {
  const controller = new AbortController();
  const t = setTimeout(() => controller.abort(), 15_000); // 15s timeout

  try {
    const res = await withAuth(url, { ...init, signal: controller.signal });
    if (res.status === 204) return null as T;

    const text = await res.text();
    if (!res.ok) {
      throw new Error(`HTTP ${res.status} – ${text?.slice(0, 200)}`);
    }
    return text ? (JSON.parse(text) as T) : (null as T);
  } finally {
    clearTimeout(t);
  }
}
