import { inject, injectable } from 'inversify';
import { In } from 'typeorm';
import { DbAccess } from 'src/access/DbAccess';
import { NotificationAccess } from 'src/access/NotificationAccess';
import { ViewCreationAccess } from 'src/access/ViewCreationAccess';
import {
  DetailedNotification,
  GetNotificationResponse,
  PatchNotificationResponse,
} from 'src/model/api/Notification';
import { NotificationType } from 'src/model/constant/Notification';
import { NotificationEntity } from 'src/model/entity/NotificationEntity';
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

  @inject(ViewCreationAccess)
  private readonly viewCreationAccess!: ViewCreationAccess;

  @inject(AwsService)
  private readonly awsService!: AwsService;

  public async cleanup() {
    await this.dbAccess.cleanup();
  }

  public async getNotifications(): Promise<GetNotificationResponse> {
    const res = await this.notificationAccess.findByUserId(this.cognitoUserId);
    const relatedTargetIds = new Set(
      res.filter((v) => v.targetId !== null).map((v) => v.targetId)
    );
    const relatedCreations = await this.viewCreationAccess.find({
      where: { id: In([...relatedTargetIds]) },
    });

    return res.map((v) => ({
      ...v,
      target: relatedCreations.find((o) => o.id === v.targetId) ?? null,
      toUser: {
        ...v.toUser,
        avatarUrl: this.awsService.getS3SignedUrl(v.toUser.avatar),
      },
      fromUser: {
        ...v.fromUser,
        avatarUrl: this.awsService.getS3SignedUrl(v.fromUser.avatar),
      },
    }));
  }

  public async setNotificationAsRead(
    id: string
  ): Promise<PatchNotificationResponse> {
    const notification = await this.notificationAccess.findOneByIdOrFail(id);
    notification.isRead = true;

    const res = await this.notificationAccess.save(notification);

    return {
      ...res,
      target: res.targetId
        ? await this.viewCreationAccess.findOneByIdOrFail(res.targetId)
        : null,
      toUser: {
        ...res.toUser,
        avatarUrl: this.awsService.getS3SignedUrl(res.toUser.avatar),
      },
      fromUser: {
        ...res.fromUser,
        avatarUrl: this.awsService.getS3SignedUrl(res.fromUser.avatar),
      },
    };
  }

  public async deleteNotification(id: string): Promise<void> {
    await this.notificationAccess.hardDeleteById(id);
  }

  public async notify(type: NotificationType, user: User, targetId?: string) {
    if (this.cognitoUserId === '') return;

    const notification = new NotificationEntity();
    notification.toUserId = user.id;
    notification.isRead = false;
    notification.type = type;
    notification.fromUserId = this.cognitoUserId;
    notification.targetId = targetId ?? null;

    const res = await this.notificationAccess.save(notification);
    const newNotification = await this.notificationAccess.findOneByIdOrFail(
      res.id
    );
    await this.awsService.sendWsMessage<DetailedNotification>(
      user.connectionId,
      {
        a: type,
        d: {
          ...newNotification,
          target: newNotification.targetId
            ? await this.viewCreationAccess.findOneByIdOrFail(
                newNotification.targetId
              )
            : null,
          toUser: {
            ...newNotification.toUser,
            avatarUrl: this.awsService.getS3SignedUrl(
              newNotification.toUser.avatar
            ),
          },
          fromUser: {
            ...newNotification.fromUser,
            avatarUrl: this.awsService.getS3SignedUrl(
              newNotification.fromUser.avatar
            ),
          },
        },
      }
    );
  }
}
