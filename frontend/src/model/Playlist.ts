import { GetExploreIdResponse } from './backend/api/Explore';

export type Playlist = Pick<GetExploreIdResponse, 'id' | 'info' | 'fileUrl' | 'fileUri'> & {
  username: string;
};
