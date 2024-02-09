import { NotificationType } from 'src/model/constant/Notification';
import { User } from 'src/model/entity/UserEntity';

export enum WsType {
  Chat = 'chat',
  Channel = 'channel',
  Ping = 'ping',
}

export type Chat = {
  user?: User;
  content: string;
  createdAt: string;
};

export type WebsocketMessage<T = { [key: string]: any }> = {
  a: NotificationType | WsType; // action
  d: T; //  data
};
