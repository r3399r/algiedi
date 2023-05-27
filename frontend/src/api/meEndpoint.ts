import { GetMeResponse } from 'src/model/backend/api/Me';
import http from 'src/util/http';

const getMe = async () => await http.authGet<GetMeResponse>('me');

export default {
  getMe,
};
