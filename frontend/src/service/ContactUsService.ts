import snsEndpoint from 'src/api/snsEndpoint';
import { PostSnsRequest } from 'src/model/api/Sns';
import { dispatch } from 'src/redux/store';
import { finishWaiting, startWaiting } from 'src/redux/uiSlice';

export const sendMessage = async (data: PostSnsRequest) => {
  try {
    dispatch(startWaiting());
    await snsEndpoint.postSns(data);
  } finally {
    dispatch(finishWaiting());
  }
};
