import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// define the type of state
export type AuthState = {
  isLogin: boolean;
};

// define the initial value of state
const initialState: AuthState = {
  isLogin: !!localStorage.getItem('token'),
};

// define the actions in "reducers"
export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setIsLogin: (state: AuthState, action: PayloadAction<boolean>) => {
      state.isLogin = action.payload;
    },
  },
});

// action creators are generated for each case reducer function
export const { setIsLogin } = authSlice.actions;

export default authSlice.reducer;
