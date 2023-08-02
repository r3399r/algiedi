import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Chat } from 'src/model/backend/api/Ws';
import { Notification } from 'src/model/backend/entity/NotificationEntity';

export type WsState = {
  lastChat: Chat | null;
  lastNotification: Notification | null;
};

const initialState: WsState = {
  lastChat: null,
  lastNotification: null,
};

export const meSlice = createSlice({
  name: 'ws',
  initialState,
  reducers: {
    setLastChat: (state: WsState, action: PayloadAction<Chat>) => {
      state.lastChat = action.payload;
    },
    setLastNotification: (state: WsState, action: PayloadAction<Notification>) => {
      state.lastNotification = action.payload;
    },
  },
});

export const { setLastChat, setLastNotification } = meSlice.actions;

export default meSlice.reducer;
