import { CognitoIdentityServiceProvider, Lambda } from 'aws-sdk';
import { inject, injectable } from 'inversify';
import { PatchUserRequest } from 'src/model/api/User';
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
}
