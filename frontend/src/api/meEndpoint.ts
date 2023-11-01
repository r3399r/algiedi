import {
  GetMeExhibitsInspirationPramas,
  GetMeExhibitsInspirationResponse,
  GetMeExhibitsOriginalPramas,
  GetMeExhibitsOriginalResponse,
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

const getMeExhibitsOriginal = async (params: GetMeExhibitsOriginalPramas) =>
  await http.authGet<Pagination<GetMeExhibitsOriginalResponse>>('me/exhibits/original', {
    params,
  });

const getMeExhibitsInspiration = async (params: GetMeExhibitsInspirationPramas) =>
  await http.authGet<Pagination<GetMeExhibitsInspirationResponse>>('me/exhibits/inspiration', {
    params,
  });

export default {
  getMe,
  putMe,
  getMeExhibitsPublished,
  getMeExhibitsOriginal,
  getMeExhibitsInspiration,
};
