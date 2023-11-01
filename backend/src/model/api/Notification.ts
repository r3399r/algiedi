import { Notification } from 'src/model/entity/NotificationEntity';
import { User } from 'src/model/entity/UserEntity';
import { ViewCreation } from 'src/model/entity/ViewCreationEntity';

export type DetailedNotification = Omit<Notification, 'toUser' | 'fromUser'> & {
  target: ViewCreation | null;
  toUser: User & { avatarUrl: string | null };
  fromUser: User & { avatarUrl: string | null };
};

export type GetNotificationResponse = DetailedNotification[];

export type PatchNotificationResponse = DetailedNotification;
