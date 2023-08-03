import { User } from 'src/model/entity/UserEntity';
import { DetailedCreation } from 'src/model/Project';

export type GetExploreResponse = DetailedCreation[];

export type GetExploreIdResponse = DetailedCreation & {
  author: (User & { following: boolean | null })[];
  inspired: DetailedCreation[];
  inspiration: DetailedCreation[];
  like: boolean;
  likeCount: number;
  comments: {
    user: User | null;
    comment: string;
    timestamp: string | null;
  }[];
};