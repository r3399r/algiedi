import { GetExploreResponse } from 'src/model/backend/api/Explore';
import http from 'src/util/http';

const getExplore = async () => await http.get<GetExploreResponse>('explore');

export default { getExplore };
