import { User } from 'src/model/entity/UserEntity';
import { DetailedCreation } from 'src/model/Project';

export type GetMeResponse = User & { avatarUrl: string | null };

export type PutMeRequest = {
  role?: string;
  language?: string;
  bio?: string;
  age?: string;
  tag?: string;
  facebook?: string;
  instagram?: string;
  youtube?: string;
  soundcloud?: string;
};

export type PutMeResponse = User & { avatarUrl: string | null };

export type GetMeSocialResponse = {
  creation: DetailedCreation[];
  followee: (User & { avatarUrl: string | null })[];
};
