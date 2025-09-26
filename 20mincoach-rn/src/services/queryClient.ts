import { QueryClient, focusManager } from '@tanstack/react-query';
import { AppState, AppStateStatus } from 'react-native';

// Re-intentos y cache razonables para PoC
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: (failureCount, error: any) => {
        // no reintentar si 401 (el interceptor ya nos saca a /auth)
        if (String(error?.message || '').includes('HTTP 401')) return false;
        return failureCount < 2;
      },
      staleTime: 30_000,    
      gcTime: 5 * 60_000,    
      refetchOnWindowFocus: true, 
    },
  },
});

// Integración básica con AppState para refocus en RN
let currentState: AppStateStatus = AppState.currentState;
AppState.addEventListener('change', (next) => {
  if (currentState.match(/inactive|background/) && next === 'active') {
    focusManager.setFocused(true);
  }
  currentState = next;
});
