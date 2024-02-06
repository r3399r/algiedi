import { PostSnsContactRequest, PostSnsSubscribeRequest } from 'src/model/backend/api/Sns';
import http from 'src/util/http';

const postSnsContact = async (data: PostSnsContactRequest) =>
  await http.post<void, PostSnsContactRequest>('sns/contact', { data });

const postSnsSubscribe = async (data: PostSnsSubscribeRequest) =>
  await http.post<void, PostSnsSubscribeRequest>('sns/subscribe', { data });

export default {
  postSnsContact,
  postSnsSubscribe,
};
