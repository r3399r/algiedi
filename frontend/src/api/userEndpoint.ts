import { PutUserRequest } from 'src/model/backend/api/User';
import http from 'src/util/http';

const putUser = async (data: PutUserRequest) =>
  await http.authPut<void, PutUserRequest>('user', { data });

export default {
  putUser,
};
