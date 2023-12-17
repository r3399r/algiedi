import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type UploadState = {
  name: string;
  description: string;
  lyrics: string;
  theme: string | null;
  genre: string | null;
  language: string | null;
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
  errorTheme: false,
  errorGenre: false,
  errorLanguage: false,
};

export const uploadSlice = createSlice({
  name: 'upload',
  initialState,
  reducers: {
    setInfo: (state: UploadState, action: PayloadAction<Partial<UploadState>>) => {
      if (action.payload.name) state.name = action.payload.name;
      if (action.payload.description) state.description = action.payload.description;
      if (action.payload.lyrics) state.lyrics = action.payload.lyrics;
      if (action.payload.theme) state.theme = action.payload.theme;
      if (action.payload.genre) state.genre = action.payload.genre;
      if (action.payload.language) state.language = action.payload.language;
      if (action.payload.errorTheme) state.errorTheme = action.payload.errorTheme;
      if (action.payload.errorGenre) state.errorGenre = action.payload.errorGenre;
      if (action.payload.errorLanguage) state.errorLanguage = action.payload.errorLanguage;
    },
  },
});

export const { setInfo } = uploadSlice.actions;

export default uploadSlice.reducer;
