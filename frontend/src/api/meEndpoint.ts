import { GetMeResponse, PutMeRequest, PutMeResponse } from 'src/model/backend/api/Me';
import http from 'src/util/http';

const getMe = async () => await http.authGet<GetMeResponse>('me');

const putMe = async (data: PutMeRequest) =>
  await http.authPut<PutMeResponse, PutMeRequest>('me', { data });

export default {
  getMe,
  putMe,
};
