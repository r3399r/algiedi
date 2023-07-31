import { User } from 'src/model/entity/UserEntity';

export type Chat = {
  user?: User;
  content: string;
  createdAt: string;
};

export type WebsocketResponse<T = { [key: string]: any }> = {
  a: string; // action
  d: T; //  data
};
