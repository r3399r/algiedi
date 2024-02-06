import snsEndpoint from 'src/api/snsEndpoint';
import { PostSnsContactRequest } from 'src/model/backend/api/Sns';
import { dispatch } from 'src/redux/store';
import { finishWaiting, startWaiting } from 'src/redux/uiSlice';

export const sendMessage = async (data: PostSnsContactRequest) => {
  try {
    dispatch(startWaiting());
    await snsEndpoint.postSnsContact(data);
  } finally {
    dispatch(finishWaiting());
  }
};
