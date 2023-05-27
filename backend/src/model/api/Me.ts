import { User } from 'src/model/entity/User';

export type GetMeResponse = User;

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

export type PutMeResponse = User;
