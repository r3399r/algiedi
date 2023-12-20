import { Status } from 'src/model/constant/Project';
import { Info } from 'src/model/entity/InfoEntity';
import { Project } from 'src/model/entity/ProjectEntity';
import { User } from 'src/model/entity/UserEntity';
import { ExploreCreation, ExploreUser } from 'src/model/Explore';
import { PaginationParams } from 'src/model/Pagination';

export type GetExploreSearchParams = {
  type?: string;
  keyword?: string;
};

export type GetExploreSearchResponse = ExploreCreation[] | ExploreUser[];

// params: type is string of lyrics, track or song divided by comma
export type GetExploreParams = PaginationParams & {
  type?: string;
  genre?: string;
  theme?: string;
  status?: Status | 'null';
  keyword?: string;
};

export type GetExploreResponse = (ExploreCreation & {
  like: boolean;
})[];

export type GetExploreFeaturedResponse = {
  song: ExploreCreation[];
  lyrics: {
    thisWeek: ExploreCreation[];
    thisMonth: ExploreCreation[];
    lastMonth: ExploreCreation[];
  };
  track: {
    thisWeek: ExploreCreation[];
    thisMonth: ExploreCreation[];
    lastMonth: ExploreCreation[];
  };
};

export type GetExploreIdResponse = Omit<ExploreCreation, 'user'> & {
  user: (User & { following: boolean | null; avatarUrl: string | null })[];
  like: boolean;
  inspired: ExploreCreation[];
  inspiration: ExploreCreation[];
  comments: {
    user: (User & { avatarUrl: string | null }) | null;
    comment: string;
    timestamp: string | null;
  }[];
};

export type GetExploreUserParams = PaginationParams & {
  role?: string;
  keyword?: string;
};

export type GetExploreUserResponse = (ExploreUser & {
  following: boolean | null;
})[];

export type GetExploreUserIdResponse = ExploreUser & {
  song: (Omit<Project, 'info'> & {
    info: Info & { coverFileUrl: string | null };
  })[];
};
