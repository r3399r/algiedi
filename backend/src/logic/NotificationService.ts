import { inject, injectable } from 'inversify';
import { DbAccess } from 'src/access/DbAccess';
import { NotificationAccess } from 'src/access/NotificationAccess';
import {
  GetNotificationResponse,
  PatchNotificationResponse,
} from 'src/model/api/Notification';
import {
  NotificationEntity,
  NotificationType,
} from 'src/model/entity/NotificationEntity';
import { User } from 'src/model/entity/UserEntity';
import { cognitoSymbol } from 'src/util/LambdaSetup';
import { AwsService } from './AwsService';

/**
 * Service class for Notification
 */
@injectable()
export class NotificationService {
  @inject(cognitoSymbol)
  private readonly cognitoUserId!: string;

  @inject(DbAccess)
  private readonly dbAccess!: DbAccess;

  @inject(NotificationAccess)
  private readonly notificationAccess!: NotificationAccess;

  @inject(AwsService)
  private readonly awsService!: AwsService;

  public async cleanup() {
    await this.dbAccess.cleanup();
  }

  public async getNotifications(): Promise<GetNotificationResponse> {
    return await this.notificationAccess.findByUserId(this.cognitoUserId);
  }

  public async setNotificationAsRead(
    id: string
  ): Promise<PatchNotificationResponse> {
    const notification = await this.notificationAccess.findOneByIdOrFail(id);
    notification.isRead = true;

    return await this.notificationAccess.save(notification);
  }

  public async notify(type: NotificationType, user: User, targetId?: string) {
    if (this.cognitoUserId === '') return;

    const notification = new NotificationEntity();
    notification.toUserId = user.id;
    notification.isRead = false;
    notification.type = type;
    notification.fromUserId = this.cognitoUserId;
    notification.targetId = targetId ?? null;

    const newNotification = await this.notificationAccess.save(notification);
    await this.awsService.sendWsMessage(user.connectionId, {
      a: type,
      d: newNotification,
    });
  }
}
