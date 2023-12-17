import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type UiState = {
  workload: number;
  isLoadingProfile: boolean;
  isLogin: boolean;
  showSnackbar: boolean;
  snackbarType: 'success' | 'fail';
  snackbarMessage: string | undefined;
  isProjectInfoEdit: boolean;
};

const initialState: UiState = {
  workload: 0,
  isLoadingProfile: false,
  isLogin: !!localStorage.getItem('token'),
  showSnackbar: false,
  snackbarType: 'success',
  snackbarMessage: undefined,
  isProjectInfoEdit: false,
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
    setLoadingProfile: (state: UiState, action: PayloadAction<boolean>) => {
      state.isLoadingProfile = action.payload;
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
    setProjectInfoIsEdit: (state: UiState, action: PayloadAction<boolean>) => {
      state.isProjectInfoEdit = action.payload;
    },
  },
});

export const {
  startWaiting,
  finishWaiting,
  setLoadingProfile,
  setIsLogin,
  openSuccessSnackbar,
  openFailSnackbar,
  closeSnackbar,
  setProjectInfoIsEdit,
} = uiSlice.actions;

export default uiSlice.reducer;
