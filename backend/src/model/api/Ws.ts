import { User } from 'src/model/entity/UserEntity';

export type Chat = {
  user?: User & { avatarUrl: string | null };
  content: string;
  createdAt: string;
};

export type WebsocketMessage<T = { [key: string]: any }> = {
  a: string; // action
  d: T; //  data
};
