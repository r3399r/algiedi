import projectEndpoint from 'src/api/projectEndpoint';
import { dispatch } from 'src/redux/store';
import { finishWaiting, startWaiting } from 'src/redux/uiSlice';

export const getProject = async () => {
  try {
    dispatch(startWaiting());
    const res = await projectEndpoint.getProject();

    return res.data;
  } catch (err) {
    throw (err as Error).message;
  } finally {
    dispatch(finishWaiting());
  }
};
