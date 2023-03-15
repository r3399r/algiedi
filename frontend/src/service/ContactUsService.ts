import { PostSnsRequest } from 'src/model/api/Sns';
import { dispatch } from 'src/redux/store';
import { finishWaiting, startWaiting } from 'src/redux/uiSlice';
import http from 'src/util/http';

export const sendMessage = async (data: PostSnsRequest) => {
  try {
    dispatch(startWaiting());
    await http.post('sns', { data });
  } finally {
    dispatch(finishWaiting());
  }
};
