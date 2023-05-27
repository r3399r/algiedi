import { PatchUserRequest } from 'src/model/backend/api/User';
import http from 'src/util/http';

const patchUser = async (data: PatchUserRequest) =>
  await http.authPatch<void, PatchUserRequest>('user', { data });

export default {
  patchUser,
};
