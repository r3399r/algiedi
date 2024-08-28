import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Chat } from 'src/model/backend/api/Ws';

export type UiState = {
  workload: number;
  isLoadingProfile: boolean;
  showSnackbar: boolean;
  snackbarType: 'success' | 'fail';
  snackbarMessage: string | undefined;
  showSnackbarChat: boolean;
  snackbarChatMessage: Chat | undefined;
  isProjectInfoEdit: boolean;
  profileTab: number;
  profileExhibitTab: number;
  hasUnsavedChanges: boolean;
};

const initialState: UiState = {
  workload: 0,
  isLoadingProfile: false,
  showSnackbar: false,
  snackbarType: 'success',
  snackbarMessage: undefined,
  showSnackbarChat: false,
  snackbarChatMessage: undefined,
  isProjectInfoEdit: false,
  profileTab: 0,
  profileExhibitTab: 0,
  hasUnsavedChanges: false,
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
    openSnackbarChat: (state: UiState, action: PayloadAction<Chat>) => {
      state.showSnackbarChat = true;
      state.snackbarChatMessage = action.payload;
    },
    closeSnackbarChat: (state: UiState) => {
      state.showSnackbarChat = false;
    },
    setProjectInfoIsEdit: (state: UiState, action: PayloadAction<boolean>) => {
      state.isProjectInfoEdit = action.payload;
    },
    setProfileTab: (state: UiState, action: PayloadAction<number>) => {
      state.profileTab = action.payload;
    },
    setProfileExhibitTab: (state: UiState, action: PayloadAction<number>) => {
      state.profileExhibitTab = action.payload;
    },
    setHasUnsavedChanges: (state: UiState, action: PayloadAction<boolean>) => {
      state.hasUnsavedChanges = action.payload;
    },
  },
});

export const {
  startWaiting,
  finishWaiting,
  setLoadingProfile,
  openSuccessSnackbar,
  openFailSnackbar,
  closeSnackbar,
  openSnackbarChat,
  closeSnackbarChat,
  setProjectInfoIsEdit,
  setProfileTab,
  setProfileExhibitTab,
  setHasUnsavedChanges,
} = uiSlice.actions;

export default uiSlice.reducer;
