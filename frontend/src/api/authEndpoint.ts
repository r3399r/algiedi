import { PostAuthLoginRequest, PostAuthLoginResponse } from 'src/model/backend/api/Auth';
import http from 'src/util/http';

const postAuthLogin = async (data: PostAuthLoginRequest) =>
  await http.post<PostAuthLoginResponse, PostAuthLoginRequest>('auth/login', { data });

export default { postAuthLogin };
