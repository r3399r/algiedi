import { PatchUserRequest, PutUserAvatarRequest } from 'src/model/backend/api/User';
import http from 'src/util/http';

const patchUser = async (data: PatchUserRequest) =>
  await http.authPatch<void, PatchUserRequest>('user', { data });

const putUserAvatar = async (data: PutUserAvatarRequest) =>
  await http.authPut<void, PutUserAvatarRequest>('user/avatar', { data });

const postUserIdFollow = async (id: string) => await http.authPost(`user/${id}/follow`);

const postUserIdUnfollow = async (id: string) => await http.authPost(`user/${id}/unfollow`);

export default {
  patchUser,
  putUserAvatar,
  postUserIdFollow,
  postUserIdUnfollow,
};
