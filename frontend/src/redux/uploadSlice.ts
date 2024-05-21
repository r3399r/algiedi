import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type UploadState = {
  name: string;
  description: string;
  lyrics: string;
  theme: string | null;
  genre: string | null;
  language: string | null;
  caption: string;
  errorTheme: boolean;
  errorGenre: boolean;
  errorLanguage: boolean;
};

const initialState: UploadState = {
  name: '',
  description: '',
  lyrics: '',
  theme: null,
  genre: null,
  language: null,
  caption: '',
  errorTheme: false,
  errorGenre: false,
  errorLanguage: false,
};

export const uploadSlice = createSlice({
  name: 'upload',
  initialState,
  reducers: {
    reset: (state: UploadState) => {
      state.name = '';
      state.description = '';
      state.lyrics = '';
      state.theme = null;
      state.genre = null;
      state.language = null;
      state.errorTheme = false;
      state.errorGenre = false;
      state.errorLanguage = false;
    },
    setInfo: (state: UploadState, action: PayloadAction<Partial<UploadState>>) => {
      if (action.payload.name !== undefined) state.name = action.payload.name;
      if (action.payload.description !== undefined) state.description = action.payload.description;
      if (action.payload.lyrics !== undefined) state.lyrics = action.payload.lyrics;
      if (action.payload.theme !== undefined) state.theme = action.payload.theme;
      if (action.payload.genre !== undefined) state.genre = action.payload.genre;
      if (action.payload.language !== undefined) state.language = action.payload.language;
      if (action.payload.caption !== undefined) state.caption = action.payload.caption;
      if (action.payload.errorTheme !== undefined) state.errorTheme = action.payload.errorTheme;
      if (action.payload.errorGenre !== undefined) state.errorGenre = action.payload.errorGenre;
      if (action.payload.errorLanguage !== undefined)
        state.errorLanguage = action.payload.errorLanguage;
    },
  },
});

export const { reset, setInfo } = uploadSlice.actions;

export default uploadSlice.reducer;
