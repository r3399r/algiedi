import { PostSnsRequest } from 'src/model/api/Sns';
import http from 'src/util/http';

export const sendMessage = async (data: PostSnsRequest) => {
  await http.post('sns', { data });
};
