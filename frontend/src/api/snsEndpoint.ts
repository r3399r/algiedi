import { PostSnsRequest } from 'src/model/api/Sns';
import http from 'src/util/http';

const postSns = async (data: PostSnsRequest) =>
  await http.post<void, PostSnsRequest>('sns', { data });

export default {
  postSns,
};
