import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Playlist } from 'src/model/Playlist';

export type PlaylistState = {
  playlist: Playlist[] | null;
  current: number | null;
};

const initialState: PlaylistState = {
  playlist: null,
  current: null,
};

export const playlistSlice = createSlice({
  name: 'playlist',
  initialState,
  reducers: {
    pushPlaylist: (state: PlaylistState, action: PayloadAction<Playlist>) => {
      state.playlist = [...(state.playlist ?? []), action.payload];
    },
    replacePlaylist: (state: PlaylistState, action: PayloadAction<Playlist[]>) => {
      state.playlist = action.payload;
    },
    setCurrent: (state: PlaylistState, action: PayloadAction<number>) => {
      state.current = action.payload;
    },
  },
});

export const { pushPlaylist, replacePlaylist, setCurrent } = playlistSlice.actions;

export default playlistSlice.reducer;
