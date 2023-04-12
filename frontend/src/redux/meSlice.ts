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
    },
  },
});

export const { setMe } = meSlice.actions;

export default meSlice.reducer;
