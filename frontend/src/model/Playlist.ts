import { GetExploreIdResponse } from './backend/api/Explore';
import { User } from './backend/entity/UserEntity';

export type Playlist = Pick<GetExploreIdResponse, 'id' | 'info' | 'fileUrl'> & { user: User[] };
