import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type MeState = {
  sub: string;
  userName: string;
  bio: string | undefined;
  emailVerified: boolean;
  language: string[];
  role: string[];
  email: string;
  age: string | undefined;
  tag: string[];
  facebook: string;
  instagram: string;
  youtube: string;
  soundcloud: string;
};

const initialState: MeState = {
  sub: '',
  userName: '',
  bio: '',
  emailVerified: false,
  language: [],
  role: [],
  email: '',
  age: '',
  tag: [],
  facebook: '',
  instagram: '',
  youtube: '',
  soundcloud: '',
};

export const meSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setMe: (state: MeState, action: PayloadAction<MeState>) => {
      state.sub = action.payload.sub;
      state.userName = action.payload.userName;
      state.bio = action.payload.bio;
      state.emailVerified = action.payload.emailVerified;
      state.language = action.payload.language;
      state.role = action.payload.role;
      state.email = action.payload.email;
      state.age = action.payload.age;
      state.tag = action.payload.tag;
      state.facebook = action.payload.facebook;
      state.instagram = action.payload.instagram;
      state.youtube = action.payload.youtube;
      state.soundcloud = action.payload.soundcloud;
    },
  },
});

export const { setMe } = meSlice.actions;

export default meSlice.reducer;
