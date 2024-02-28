import { NotificationType } from 'src/model/constant/Notification';
import { Project } from 'src/model/entity/ProjectEntity';
import { User } from 'src/model/entity/UserEntity';

export enum WsType {
  Chat = 'chat',
  Channel = 'channel',
  Ping = 'ping',
}

export type Chat = {
  user?: User;
  project?: Project;
  content: string;
  createdAt: string;
};

export type WebsocketMessage<T = { [key: string]: any }> = {
  a: NotificationType | WsType; // action
  d: T; //  data
};
