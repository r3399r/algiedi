import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Chat } from 'src/model/backend/api/Ws';

export type WsState = {
  lastChat: Chat | null;
};

const initialState: WsState = {
  lastChat: null,
};

export const wsSlice = createSlice({
  name: 'ws',
  initialState,
  reducers: {
    setLastChat: (state: WsState, action: PayloadAction<Chat>) => {
      state.lastChat = action.payload;
    },
  },
});

export const { setLastChat } = wsSlice.actions;

export default wsSlice.reducer;
