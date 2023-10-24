import {
  GetExploreFeaturedResponse,
  GetExploreIdResponse,
  GetExploreParams,
  GetExploreResponse,
  GetExploreSearchParams,
  GetExploreSearchResponse,
} from 'src/model/backend/api/Explore';
import { Pagination } from 'src/model/backend/Pagination';
import http from 'src/util/http';

const getExplore = async (params?: GetExploreParams) =>
  await http.get<Pagination<GetExploreResponse>>('explore', { params });

const getExploreAuth = async (params?: GetExploreParams) =>
  await http.authGet<Pagination<GetExploreResponse>>('explore/auth', { params });

const getExploreFeatured = async () =>
  await http.get<GetExploreFeaturedResponse>('explore/featured');

const getExploreSearch = async (params?: GetExploreSearchParams) =>
  await http.get<GetExploreSearchResponse>('explore/search', { params });

const getExploreId = async (id: string) => await http.get<GetExploreIdResponse>(`explore/${id}`);

const getExploreIdAuth = async (id: string) =>
  await http.authGet<GetExploreIdResponse>(`explore/${id}/auth`);

export default {
  getExplore,
  getExploreAuth,
  getExploreFeatured,
  getExploreSearch,
  getExploreId,
  getExploreIdAuth,
};
