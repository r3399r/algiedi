import { CognitoIdentityServiceProvider } from 'aws-sdk';
import { inject, injectable } from 'inversify';
import { DbAccess } from 'src/access/DbAccess';
import { FollowAccess } from 'src/access/FollowAccess';
import { UserAccess } from 'src/access/UserAccess';
import { PatchUserRequest, PutUserAvatarRequest } from 'src/model/api/User';
import { NotificationType } from 'src/model/constant/Notification';
import { FollowEntity } from 'src/model/entity/FollowEntity';
import { cognitoSymbol } from 'src/util/LambdaSetup';
import { AwsService } from './AwsService';
import { NotificationService } from './NotificationService';

/**
 * Service class for User
 */
@injectable()
export class UserService {
  @inject(cognitoSymbol)
  private readonly cognitoUserId!: string;

  @inject(AwsService)
  private readonly awsService!: AwsService;

  @inject(CognitoIdentityServiceProvider)
  private readonly cognitoProvider!: CognitoIdentityServiceProvider;

  @inject(DbAccess)
  private readonly dbAccess!: DbAccess;

  @inject(UserAccess)
  private readonly userAccess!: UserAccess;

  @inject(FollowAccess)
  private readonly followAccess!: FollowAccess;

  @inject(NotificationService)
  private readonly notificationService!: NotificationService;

  public async cleanup() {
    await this.dbAccess.cleanup();
  }

  public async initUser(data: PatchUserRequest) {
    // update cognito
    await this.cognitoProvider
      .adminUpdateUserAttributes({
        UserPoolId: process.env.USER_POOL_ID ?? 'xx',
        Username: this.cognitoUserId,
        UserAttributes: [
          {
            Name: 'custom:status',
            Value: 'ready',
          },
        ],
      })
      .promise();

    // init user
    const user = await this.userAccess.findOneByIdOrFail(this.cognitoUserId);
    user.age = Number(data.age);
    user.region = data.region;
    user.role = data.role;
    user.language = data.language;
    user.bio = `I am good at playing the ${data.instrument}.`;
    user.tag = data.favoriate;

    await this.userAccess.save(user);
  }

  public async updateAvatar(data: PutUserAvatarRequest) {
    const user = await this.userAccess.findOneByIdOrFail(this.cognitoUserId);

    const key = await this.awsService.s3Upload(
      data.file,
      `user/${this.cognitoUserId}`
    );
    user.avatar = key;
    await this.userAccess.save(user);
  }

  public async followUser(id: string) {
    const followEntity = new FollowEntity();
    followEntity.followerId = this.cognitoUserId;
    followEntity.followeeId = id;
    await this.followAccess.save(followEntity);

    const user = await this.userAccess.findOneByIdOrFail(id);

    // notify
    await this.notificationService.notify(NotificationType.Follow, user);
  }

  public async unfollowUser(id: string) {
    const oldLike = await this.followAccess.findOneOrFail({
      where: { followerId: this.cognitoUserId, followeeId: id },
    });
    await this.followAccess.hardDeleteById(oldLike.id);
  }
}
