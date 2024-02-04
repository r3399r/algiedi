import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { GetExploreResponse } from 'src/model/backend/api/Explore';
import { DetailedNotification } from 'src/model/backend/api/Notification';
import { GetProjectResponse } from 'src/model/backend/api/Project';

// define the type of state
export type ApiState = {
  projects?: GetProjectResponse;
  explores?: GetExploreResponse;
  notifications?: DetailedNotification[];
};

// define the initial value of state
const initialState: ApiState = {
  projects: undefined,
  explores: undefined,
  notifications: undefined,
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
    setNotifications: (state: ApiState, action: PayloadAction<DetailedNotification[]>) => {
      state.notifications = action.payload;
    },
    setLastNotification: (state: ApiState, action: PayloadAction<DetailedNotification>) => {
      state.notifications = [action.payload, ...(state.notifications ?? [])];
    },
    replaceNotification: (state: ApiState, action: PayloadAction<DetailedNotification>) => {
      state.notifications = state.notifications?.map((v) =>
        v.id === action.payload.id ? action.payload : v,
      );
    },
    filterNotification: (state: ApiState, action: PayloadAction<string>) => {
      state.notifications = state.notifications?.filter((v) => v.id !== action.payload);
    },
  },
});

// action creators are generated for each case reducer function
export const {
  reset,
  setProjects,
  setExplores,
  setNotifications,
  setLastNotification,
  replaceNotification,
  filterNotification,
} = apiSlice.actions;

export default apiSlice.reducer;
