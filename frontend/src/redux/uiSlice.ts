import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type UiState = {
  workload: number;
  isLogin: boolean;
  showSnackbar: boolean;
  snackbarType: 'success' | 'fail';
  snackbarMessage: string | undefined;
};

const initialState: UiState = {
  workload: 0,
  isLogin: !!localStorage.getItem('token'),
  showSnackbar: false,
  snackbarType: 'success',
  snackbarMessage: undefined,
};

export const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    startWaiting: (state: UiState) => {
      state.workload = state.workload + 1;
    },
    finishWaiting: (state: UiState) => {
      state.workload = state.workload - 1;
    },
    setIsLogin: (state: UiState, action: PayloadAction<boolean>) => {
      state.isLogin = action.payload;
    },
    openSuccessSnackbar: (state: UiState, action: PayloadAction<string>) => {
      state.showSnackbar = true;
      state.snackbarType = 'success';
      state.snackbarMessage = action.payload;
    },
    openFailSnackbar: (state: UiState, action: PayloadAction<string>) => {
      state.showSnackbar = true;
      state.snackbarType = 'fail';
      state.snackbarMessage = action.payload;
    },
    closeSnackbar: (state: UiState) => {
      state.showSnackbar = false;
    },
  },
});

export const {
  startWaiting,
  finishWaiting,
  setIsLogin,
  openSuccessSnackbar,
  openFailSnackbar,
  closeSnackbar,
} = uiSlice.actions;

export default uiSlice.reducer;
