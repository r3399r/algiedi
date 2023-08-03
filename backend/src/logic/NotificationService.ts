import { inject, injectable } from 'inversify';
import { DbAccess } from 'src/access/DbAccess';
import { NotificationAccess } from 'src/access/NotificationAccess';
import {
  GetNotificationResponse,
  PatchNotificationResponse,
} from 'src/model/api/Notification';
import { cognitoSymbol } from 'src/util/LambdaSetup';

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
}