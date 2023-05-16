import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { GetProjectResponse } from 'src/model/backend/api/Project';

// define the type of state
export type ApiState = {
  projects?: GetProjectResponse;
};

// define the initial value of state
const initialState: ApiState = {
  projects: undefined,
};

// define the actions in "reducers"
export const apiSlice = createSlice({
  name: 'api',
  initialState,
  reducers: {
    setProjects: (state: ApiState, action: PayloadAction<GetProjectResponse>) => {
      state.projects = action.payload;
    },
  },
});

// action creators are generated for each case reducer function
export const { setProjects } = apiSlice.actions;

export default apiSlice.reducer;
