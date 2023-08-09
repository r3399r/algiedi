import { CognitoIdentityServiceProvider } from 'aws-sdk';
import { inject, injectable } from 'inversify';
import { DbAccess } from 'src/access/DbAccess';
import { FollowAccess } from 'src/access/FollowAccess';
import { UserAccess } from 'src/access/UserAccess';
import { PatchUserRequest } from 'src/model/api/User';
import { FollowEntity } from 'src/model/entity/FollowEntity';
import { cognitoSymbol } from 'src/util/LambdaSetup';

/**
 * Service class for User
 */
@injectable()
export class UserService {
  @inject(cognitoSymbol)
  private readonly cognitoUserId!: string;

  // @inject(Lambda)
  // private readonly lambda!: Lambda;

  @inject(CognitoIdentityServiceProvider)
  private readonly cognitoProvider!: CognitoIdentityServiceProvider;

  @inject(DbAccess)
  private readonly dbAccess!: DbAccess;

  @inject(UserAccess)
  private readonly userAccess!: UserAccess;

  @inject(FollowAccess)
  private readonly followAccess!: FollowAccess;

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
    user.role = data.role;
    user.language = data.language;
    user.bio = `I am good at playing the ${data.instrument}.`;
    user.tag = data.favoriate;

    await this.userAccess.save(user);
  }

  public async followUser(id: string) {
    const followEntity = new FollowEntity();
    followEntity.followerId = this.cognitoUserId;
    followEntity.followeeId = id;
    await this.followAccess.save(followEntity);
  }

  public async unfollowUser(id: string) {
    const oldLike = await this.followAccess.findOneOrFail({
      where: { followerId: this.cognitoUserId, followeeId: id },
    });
    await this.followAccess.hardDeleteById(oldLike.id);
  }
}
