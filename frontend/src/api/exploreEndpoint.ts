import { GetExploreIdResponse, GetExploreResponse } from 'src/model/backend/api/Explore';
import http from 'src/util/http';

const getExplore = async () => await http.get<GetExploreResponse>('explore');

const getExploreId = async (id: string) => await http.get<GetExploreIdResponse>(`explore/${id}`);

const getExploreIdAuth = async (id: string) =>
  await http.authGet<GetExploreIdResponse>(`explore/${id}/auth`);

export default { getExplore, getExploreId, getExploreIdAuth };
