import {
  GetExploreIdResponse,
  GetExploreParams,
  GetExploreResponse,
} from 'src/model/backend/api/Explore';
import { Pagination } from 'src/model/backend/Pagination';
import http from 'src/util/http';

const getExplore = async (params?: GetExploreParams) =>
  await http.get<Pagination<GetExploreResponse>>('explore', { params });

const getExploreAuth = async (params?: GetExploreParams) =>
  await http.authGet<Pagination<GetExploreResponse>>('explore/auth', { params });

const getExploreId = async (id: string) => await http.get<GetExploreIdResponse>(`explore/${id}`);

const getExploreIdAuth = async (id: string) =>
  await http.authGet<GetExploreIdResponse>(`explore/${id}/auth`);

export default { getExplore, getExploreAuth, getExploreId, getExploreIdAuth };
