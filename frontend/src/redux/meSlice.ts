import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type MeState = {
  id: string;
  email: string;
  username: string;
  role: string[];
  age: string | undefined;
  language: string[];
  bio: string | undefined;
  tag: string[];
  facebook: string;
  instagram: string;
  youtube: string;
  soundcloud: string;
  avatar: string | null;
  lastProjectId: string | undefined;
};

const initialState: MeState = {
  id: '',
  email: '',
  username: '',
  role: [],
  age: '',
  language: [],
  bio: '',
  tag: [],
  facebook: '',
  instagram: '',
  youtube: '',
  soundcloud: '',
  avatar: null,
  lastProjectId: undefined,
};

export const meSlice = createSlice({
  name: 'me',
  initialState,
  reducers: {
    reset: (state: MeState) => {
      state.id = initialState.id;
      state.email = initialState.email;
      state.username = initialState.username;
      state.role = initialState.role;
      state.age = initialState.age;
      state.language = initialState.language;
      state.bio = initialState.bio;
      state.tag = initialState.tag;
      state.facebook = initialState.facebook;
      state.instagram = initialState.instagram;
      state.youtube = initialState.youtube;
      state.soundcloud = initialState.soundcloud;
      state.avatar = initialState.avatar;
      state.lastProjectId = initialState.lastProjectId;
    },
    setMe: (state: MeState, action: PayloadAction<MeState>) => {
      state.id = action.payload.id;
      state.email = action.payload.email;
      state.username = action.payload.username;
      state.role = action.payload.role;
      state.age = action.payload.age;
      state.language = action.payload.language;
      state.bio = action.payload.bio;
      state.tag = action.payload.tag;
      state.facebook = action.payload.facebook;
      state.instagram = action.payload.instagram;
      state.youtube = action.payload.youtube;
      state.soundcloud = action.payload.soundcloud;
      state.avatar = action.payload.avatar;
      state.lastProjectId = action.payload.lastProjectId;
    },
    setLastProjectId: (state: MeState, action: PayloadAction<string>) => {
      state.lastProjectId = action.payload;
    },
  },
});

export const { reset, setMe, setLastProjectId } = meSlice.actions;

export default meSlice.reducer;
