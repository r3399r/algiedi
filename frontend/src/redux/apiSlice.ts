import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { GetExploreResponse } from 'src/model/backend/api/Explore';
import { GetProjectResponse } from 'src/model/backend/api/Project';

// define the type of state
export type ApiState = {
  projects?: GetProjectResponse;
  explores?: GetExploreResponse;
};

// define the initial value of state
const initialState: ApiState = {
  projects: undefined,
  explores: undefined,
};

// define the actions in "reducers"
export const apiSlice = createSlice({
  name: 'api',
  initialState,
  reducers: {
    reset: (state: ApiState) => {
      state.projects = initialState.projects;
    },
    setProjects: (state: ApiState, action: PayloadAction<GetProjectResponse>) => {
      state.projects = action.payload;
    },
    setExplores: (state: ApiState, action: PayloadAction<GetExploreResponse>) => {
      state.explores = action.payload;
    },
  },
});

// action creators are generated for each case reducer function
export const { reset, setProjects, setExplores } = apiSlice.actions;

export default apiSlice.reducer;
