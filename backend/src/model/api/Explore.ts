import { User } from 'src/model/entity/UserEntity';
import { DetailedCreation } from 'src/model/Project';

export type GetExploreResponse = DetailedCreation[];

export type GetExploreIdResponse = DetailedCreation & {
  user: User;
  inspired: DetailedCreation | null;
  inspiration: DetailedCreation[];
};
