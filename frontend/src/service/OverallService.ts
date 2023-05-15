import projectEndpoint from 'src/api/projectEndpoint';
import { setProjects } from 'src/redux/apiSlice';
import { dispatch, getState } from 'src/redux/store';
import { finishWaiting, startWaiting } from 'src/redux/uiSlice';

export const loadProjects = async () => {
  const res = await projectEndpoint.getProject();
  dispatch(setProjects(res.data));

  return res.data;
};

export const getMyProjects = async () => {
  try {
    dispatch(startWaiting());

    const { projects } = getState().api;
    if (projects !== undefined) return projects;

    return await loadProjects();
  } catch (err) {
    throw (err as Error).message;
  } finally {
    dispatch(finishWaiting());
  }
};
