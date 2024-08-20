import { CognitoIdentityServiceProvider } from 'aws-sdk';
import axios from 'axios';
import { inject, injectable } from 'inversify';
import { UserAccess } from 'src/access/UserAccess';
import {
  PostAuthLoginRequest,
  PostAuthLoginResponse,
  PostAuthRefreshTokenRequest,
  PostAuthRefreshTokenResponse,
} from 'src/model/api/Auth';
import { UserEntity } from 'src/model/entity/UserEntity';
import { BadRequestError, InternalServerError } from 'src/model/error';
import { Oauth, UserInfo } from 'src/model/Google';

/**
 * Service class for Auth
 */
@injectable()
export class AuthService {
  @inject(UserAccess)
  private readonly userAccess!: UserAccess;

  @inject(CognitoIdentityServiceProvider)
  private readonly cognitoProvider!: CognitoIdentityServiceProvider;

  private async adminInitiateAuth(username: string) {
    return await this.cognitoProvider
      .adminInitiateAuth({
        UserPoolId: process.env.USER_POOL_ID ?? '',
        ClientId: process.env.USER_POOL_CLIENT_ID ?? '',
        AuthFlow: 'ADMIN_USER_PASSWORD_AUTH',
        AuthParameters: {
          USERNAME: username,
          PASSWORD: process.env.TEMP_PWD ?? '',
        },
      })
      .promise();
  }

  public async refreshToken(
    data: PostAuthRefreshTokenRequest
  ): Promise<PostAuthRefreshTokenResponse> {
    const res = await this.cognitoProvider
      .adminInitiateAuth({
        UserPoolId: process.env.USER_POOL_ID ?? '',
        ClientId: process.env.USER_POOL_CLIENT_ID ?? '',
        AuthFlow: 'REFRESH_TOKEN_AUTH',
        AuthParameters: {
          REFRESH_TOKEN: data.refreshToken,
        },
      })
      .promise();

    if (!res.AuthenticationResult)
      throw new BadRequestError('Invalid refresh token');

    return {
      accessToken: res.AuthenticationResult.AccessToken ?? '',
      expiresIn: res.AuthenticationResult.ExpiresIn ?? 0,
      idToken: res.AuthenticationResult.IdToken ?? '',
    };
  }

  public async login(
    data: PostAuthLoginRequest
  ): Promise<PostAuthLoginResponse> {
    if (data.platform === 'google') {
      const resOauth = await axios.request<Oauth>({
        method: 'POST',
        url: 'https://oauth2.googleapis.com/token',
        data: {
          code: data.code,
          client_id: process.env.GOOGLE_CLIENT_ID,
          client_secret: process.env.GOOGLE_CLIENT_SECRET,
          redirect_uri: data.redirectUrl,
          grant_type: 'authorization_code',
        },
      });

      const resUser = await axios.request<UserInfo>({
        method: 'GET',
        url: 'https://www.googleapis.com/oauth2/v1/userinfo',
        headers: {
          Authorization: `Bearer ${resOauth.data.access_token}`,
        },
      });

      let user = await this.userAccess.findOne({
        where: { email: resUser.data.email },
      });
      if (user !== null && user.platform !== 'google')
        throw new BadRequestError(
          'This email is already registered with another login method'
        );

      if (user === null) {
        const newCognitoUser = await this.cognitoProvider
          .adminCreateUser({
            UserPoolId: process.env.USER_POOL_ID ?? '',
            Username: resUser.data.email,
            TemporaryPassword: process.env.TEMP_PWD,
            MessageAction: 'SUPPRESS',
          })
          .promise();

        user = new UserEntity();
        user.id = newCognitoUser.User?.Username ?? '';
        user.email = resUser.data.email;
        user.username = resUser.data.name;
        user.platform = 'google';
        await this.userAccess.save(user);
      }

      const resAuth = await this.adminInitiateAuth(user.id);

      console.log(JSON.stringify(resAuth));

      if (resAuth.ChallengeName === 'NEW_PASSWORD_REQUIRED') {
        await this.cognitoProvider
          .adminRespondToAuthChallenge({
            UserPoolId: process.env.USER_POOL_ID ?? '',
            ClientId: process.env.USER_POOL_CLIENT_ID ?? '',
            ChallengeName: 'NEW_PASSWORD_REQUIRED',
            ChallengeResponses: {
              USERNAME: user.id,
              NEW_PASSWORD: process.env.TEMP_PWD ?? '',
            },
            Session: resAuth.Session,
          })
          .promise();

        const resAuth2 = await this.adminInitiateAuth(user.id);

        return {
          accessToken: resAuth2.AuthenticationResult?.AccessToken ?? '',
          expiresIn: resAuth2.AuthenticationResult?.ExpiresIn ?? -1,
          refreshToken: resAuth2.AuthenticationResult?.RefreshToken ?? '',
          idToken: resAuth.AuthenticationResult?.IdToken ?? '',
          questionnaireFilled: user.questionnaireFilled ?? false,
        };
      } else if (resAuth.ChallengeName !== undefined)
        throw new InternalServerError(
          'Unexpected error happened. Please inform the administrator'
        );

      return {
        accessToken: resAuth.AuthenticationResult?.AccessToken ?? '',
        expiresIn: resAuth.AuthenticationResult?.ExpiresIn ?? -1,
        refreshToken: resAuth.AuthenticationResult?.RefreshToken ?? '',
        idToken: resAuth.AuthenticationResult?.IdToken ?? '',
        questionnaireFilled: user.questionnaireFilled ?? false,
      };
    } else if (data.platform === 'cognito') {
      const resAuth = await this.cognitoProvider
        .initiateAuth({
          AuthFlow: 'USER_PASSWORD_AUTH',
          ClientId: process.env.USER_POOL_CLIENT_ID ?? '',
          AuthParameters: {
            USERNAME: data.email,
            PASSWORD: data.password,
          },
        })
        .promise();

      const user = await this.userAccess.findOneOrFail({
        where: { email: data.email },
      });

      return {
        accessToken: resAuth.AuthenticationResult?.AccessToken ?? '',
        expiresIn: resAuth.AuthenticationResult?.ExpiresIn ?? -1,
        refreshToken: resAuth.AuthenticationResult?.RefreshToken ?? '',
        idToken: resAuth.AuthenticationResult?.IdToken ?? '',
        questionnaireFilled: user.questionnaireFilled ?? false,
      };
    }

    return {
      accessToken: 'xxx',
      expiresIn: -1,
      refreshToken: 'xxx',
      idToken: 'xxx',
      questionnaireFilled: false,
    };
  }
}
