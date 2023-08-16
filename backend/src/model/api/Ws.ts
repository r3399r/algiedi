import { NotificationType } from 'src/model/entity/NotificationEntity';
import { User } from 'src/model/entity/UserEntity';

export enum WsType {
  Chat = 'chat',
  Channel = 'channel',
}

export type Chat = {
  user?: User & { avatarUrl: string | null };
  content: string;
  createdAt: string;
};

export type WebsocketMessage<T = { [key: string]: any }> = {
  a: NotificationType | WsType; // action
  d: T; //  data
};
