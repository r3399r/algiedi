import { GetProjectResponse } from 'src/model/backend/api/Project';
import { dispatch, getState } from 'src/redux/store';
import { finishWaiting, startWaiting } from 'src/redux/uiSlice';
import { loadProjects } from './OverallService';

export const getLatestProject = async (): Promise<GetProjectResponse[0] | null> => {
  try {
    dispatch(startWaiting());

    const { projects } = getState().api;
    let myProjects: GetProjectResponse;

    if (projects !== undefined) myProjects = projects;
    else myProjects = await loadProjects();

    return myProjects.length > 0 ? myProjects[0] : null;
  } catch (err) {
    throw (err as Error).message;
  } finally {
    dispatch(finishWaiting());
  }
};
