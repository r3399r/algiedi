import { configureStore, PayloadAction, Store } from '@reduxjs/toolkit';
import apiReducer, { ApiState } from './apiSlice';
import authReducer, { AuthState } from './authSlice';
import meReducer, { MeState } from './meSlice';
import playlistReducer, { PlaylistState } from './playlistSlice';
import uiReducer, { UiState } from './uiSlice';
import uploadReducer, { UploadState } from './uploadSlice';
import wsReducer, { WsState } from './wsSlice';

export type RootState = {
  me: MeState;
  api: ApiState;
  ui: UiState;
  auth: AuthState;
  ws: WsState;
  playlist: PlaylistState;
  upload: UploadState;
};

let store: Store<RootState>;

export const configStore = () => {
  store = configureStore({
    reducer: {
      api: apiReducer,
      me: meReducer,
      ui: uiReducer,
      auth: authReducer,
      ws: wsReducer,
      playlist: playlistReducer,
      upload: uploadReducer,
    },
  });

  return store;
};

export const getState = () => store.getState();

export const dispatch = <T>(action: PayloadAction<T>) => store.dispatch(action);
