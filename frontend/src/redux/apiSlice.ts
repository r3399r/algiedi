import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { GetExploreResponse } from 'src/model/backend/api/Explore';
import { GetNotificationResponse } from 'src/model/backend/api/Notification';
import { GetProjectResponse } from 'src/model/backend/api/Project';
import { Notification } from 'src/model/backend/entity/NotificationEntity';

// define the type of state
export type ApiState = {
  projects?: GetProjectResponse;
  explores?: GetExploreResponse;
  notifications?: GetNotificationResponse;
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
    setNotifications: (state: ApiState, action: PayloadAction<GetNotificationResponse>) => {
      state.notifications = action.payload;
    },
    setLastNotification: (state: ApiState, action: PayloadAction<Notification>) => {
      state.notifications = [action.payload, ...(state.notifications ?? [])];
    },
    replaceNotification: (state: ApiState, action: PayloadAction<Notification>) => {
      state.notifications = state.notifications?.map((v) =>
        v.id === action.payload.id ? action.payload : v,
      );
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
} = apiSlice.actions;

export default apiSlice.reducer;
