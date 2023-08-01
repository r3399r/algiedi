import { configureStore, PayloadAction, Store } from '@reduxjs/toolkit';
import apiReducer, { ApiState } from './apiSlice';
import meReducer, { MeState } from './meSlice';
import uiReducer, { UiState } from './uiSlice';
import variableReducer, { VariableState } from './variableSlice';
import wsReducer, { WsState } from './wsSlice';

export type RootState = {
  me: MeState;
  api: ApiState;
  ui: UiState;
  variable: VariableState;
  ws: WsState;
};

let store: Store<RootState>;

export const configStore = () => {
  store = configureStore({
    reducer: {
      api: apiReducer,
      me: meReducer,
      ui: uiReducer,
      variable: variableReducer,
      ws: wsReducer,
    },
  });

  return store;
};

export const getState = () => store.getState();

export const dispatch = <T>(action: PayloadAction<T>) => store.dispatch(action);
