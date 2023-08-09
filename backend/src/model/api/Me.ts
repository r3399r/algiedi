import { User } from 'src/model/entity/UserEntity';

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
