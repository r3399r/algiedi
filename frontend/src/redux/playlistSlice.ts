import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Playlist } from 'src/model/Playlist';

export type PlaylistState = {
  isClicked: boolean;
  playlist: Playlist[] | null;
  current: number | null;
};

const initialState: PlaylistState = {
  isClicked: false,
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
    setCurrent: (state: PlaylistState, action: PayloadAction<number>) => {
      state.current = action.payload;
      state.isClicked = !state.isClicked;
    },
    removePlaylistId: (state: PlaylistState, action: PayloadAction<string>) => {
      state.playlist = state.playlist?.filter((v) => v.id !== action.payload) ?? null;
    },
  },
});

export const { pushPlaylist, setCurrent, removePlaylistId } = playlistSlice.actions;

export default playlistSlice.reducer;
