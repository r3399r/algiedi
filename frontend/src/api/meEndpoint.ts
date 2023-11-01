import {
  GetMeExhibitsPublishedParams,
  GetMeExhibitsPublishedResponse,
  GetMeResponse,
  PutMeRequest,
  PutMeResponse,
} from 'src/model/backend/api/Me';
import { Pagination } from 'src/model/backend/Pagination';
import http from 'src/util/http';

const getMe = async () => await http.authGet<GetMeResponse>('me');

const putMe = async (data: PutMeRequest) =>
  await http.authPut<PutMeResponse, PutMeRequest>('me', { data });

const getMeExhibitsPublished = async (params: GetMeExhibitsPublishedParams) =>
  await http.authGet<Pagination<GetMeExhibitsPublishedResponse>>('me/exhibits/published', {
    params,
  });

export default {
  getMe,
  putMe,
  getMeExhibitsPublished,
};
