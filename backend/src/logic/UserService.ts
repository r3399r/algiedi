import { CognitoIdentityServiceProvider, Lambda } from 'aws-sdk';
import { inject, injectable } from 'inversify';
import { FollowAccess } from 'src/access/FollowAccess';
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

  @inject(Lambda)
  private readonly lambda!: Lambda;

  @inject(CognitoIdentityServiceProvider)
  private readonly cognitoProvider!: CognitoIdentityServiceProvider;

  @inject(FollowAccess)
  private readonly followAccess!: FollowAccess;

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

    // trigger lambda to update db
    await this.lambda
      .invoke({
        FunctionName: `${process.env.PROJECT}-${process.env.ENVR}-vpc`,
        Payload: JSON.stringify({
          source: 'init-user',
          data: {
            id: this.cognitoUserId,
            role: data.role,
            language: data.language,
            bio: `I am good at playing the ${data.instrument}.`,
            tag: data.favoriate,
          },
        }),
      })
      .promise();
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
