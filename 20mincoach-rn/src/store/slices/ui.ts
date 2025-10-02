import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type Toast = { kind: 'success' | 'error' | 'info'; msg: string } | null;

export interface UiState {
  busy: boolean;
  toast: Toast;
}

const initialState: UiState = {
  busy: false,
  toast: null,
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setBusy(state, action: PayloadAction<boolean>) {
      state.busy = action.payload;
    },
    showToast(state, action: PayloadAction<Toast>) {
      state.toast = action.payload;
    },
    clearToast(state) {
      state.toast = null;
    },
  },
});

export const { setBusy, showToast, clearToast } = uiSlice.actions;
export default uiSlice.reducer;
