import { Info } from 'src/model/entity/InfoEntity';
import { User } from 'src/model/entity/UserEntity';
import { ViewCreationExplore } from 'src/model/entity/ViewCreationExploreEntity';
import { PaginationParams } from 'src/model/Pagination';
import { DetailedCreation, ExtendedCreation } from 'src/model/Project';

// params: type is string of lyrics, track or song divided by comma
export type GetExploreParams = PaginationParams & { type: string };

export type FilledCreation = Omit<ViewCreationExplore, 'user' | 'info'> & {
  fileUrl: string | null;
  tabFileUrl: string | null;
  user: (User & { avatarUrl: string | null })[];
  info: Info & { coverFileUrl: string | null };
  like: boolean;
};

export type GetExploreResponse = (Omit<ViewCreationExplore, 'user' | 'info'> & {
  fileUrl: string | null;
  tabFileUrl: string | null;
  user: (User & { avatarUrl: string | null })[];
  info: Info & { coverFileUrl: string | null };
  like: boolean;
})[];

export type GetExploreIdResponse = Omit<
  ViewCreationExplore,
  'user' | 'info'
> & {
  fileUrl: string | null;
  tabFileUrl: string | null;
  user: (User & { following: boolean | null; avatarUrl: string | null })[];
  info: Info & { coverFileUrl: string | null };
  inspired: ExtendedCreation[];
  inspiration: ExtendedCreation[];
  like: boolean;
  likeCount: number;
  comments: {
    user: (User & { avatarUrl: string | null }) | null;
    comment: string;
    timestamp: string | null;
  }[];
};

export type GetExploreIdResponseOld = DetailedCreation & {
  author: (User & { following: boolean | null; avatarUrl: string | null })[];
  inspired: DetailedCreation[];
  inspiration: DetailedCreation[];
  like: boolean;
  likeCount: number;
  comments: {
    user: (User & { avatarUrl: string | null }) | null;
    comment: string;
    timestamp: string | null;
  }[];
};
