// src/store/slices/auth.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type AuthState = {
  email: string | null;
  roles: string[];        // ["BasicUser"] | ["PremiumUser"]
  accessToken: string | null;
};

const initialState: AuthState = {
  email: null,
  roles: [],
  accessToken: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setAuth(state, action: PayloadAction<AuthState>) {
      state.email = action.payload.email;
      state.roles = action.payload.roles || [];
      state.accessToken = action.payload.accessToken ?? null;
    },
    clearAuth(state) {
      state.email = null;
      state.roles = [];
      state.accessToken = null;
    },
  },
});

export const { setAuth, clearAuth } = authSlice.actions;
export default authSlice.reducer;
