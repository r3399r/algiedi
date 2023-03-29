import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type MeState = {
  sub: string;
  firstName: string;
  lastName: string;
  bio: string;
  emailVerified: boolean;
  language: string[];
  role: string[];
  email: string;
  age: string;
};

const initialState: MeState = {
  sub: '',
  firstName: '',
  lastName: '',
  bio: '',
  emailVerified: false,
  language: [],
  role: [],
  email: '',
  age: '',
};

export const meSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setMe: (state: MeState, action: PayloadAction<MeState>) => {
      state.sub = action.payload.sub;
      state.firstName = action.payload.firstName;
      state.lastName = action.payload.lastName;
      state.bio = action.payload.bio;
      state.emailVerified = action.payload.emailVerified;
      state.language = action.payload.language;
      state.role = action.payload.role;
      state.email = action.payload.email;
      state.age = action.payload.age;
    },
    setRole: (state: MeState, action: PayloadAction<string[]>) => {
      state.role = action.payload;
    },
    setAge: (state: MeState, action: PayloadAction<string>) => {
      state.age = action.payload;
    },
    setLanguage: (state: MeState, action: PayloadAction<string[]>) => {
      state.language = action.payload;
    },
    setBio: (state: MeState, action: PayloadAction<string>) => {
      state.bio = action.payload;
    },
  },
});

export const { setMe, setRole, setAge, setLanguage, setBio } = meSlice.actions;

export default meSlice.reducer;
