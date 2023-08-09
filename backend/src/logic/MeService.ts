import { inject, injectable } from 'inversify';
import { DbAccess } from 'src/access/DbAccess';
import { UserAccess } from 'src/access/UserAccess';
import { GetMeResponse, PutMeRequest, PutMeResponse } from 'src/model/api/Me';
import { cognitoSymbol } from 'src/util/LambdaSetup';
import { AwsService } from './AwsService';

/**
 * Service class for Me
 */
@injectable()
export class MeService {
  @inject(cognitoSymbol)
  private readonly cognitoUserId!: string;

  @inject(DbAccess)
  private readonly dbAccess!: DbAccess;

  @inject(UserAccess)
  private readonly userAccess!: UserAccess;

  @inject(AwsService)
  private readonly awsService!: AwsService;

  public async cleanup() {
    await this.dbAccess.cleanup();
  }

  public async getMe(): Promise<GetMeResponse> {
    const user = await this.userAccess.findOneByIdOrFail(this.cognitoUserId);

    return { ...user, avatarUrl: this.awsService.getS3SignedUrl(user.avatar) };
  }

  public async updateMe(data: PutMeRequest): Promise<PutMeResponse> {
    const user = await this.userAccess.findOneByIdOrFail(this.cognitoUserId);

    user.role = data.role ?? user.role;
    user.language = data.language ?? user.language;
    user.bio = data.bio ?? user.bio;
    user.age = Number(data.age) ?? user.age;
    user.tag = data.tag ?? user.tag;
    user.facebook = data.facebook ?? user.facebook;
    user.instagram = data.instagram ?? user.instagram;
    user.youtube = data.youtube ?? user.youtube;
    user.soundcloud = data.soundcloud ?? user.soundcloud;
    await this.userAccess.save(user);

    return { ...user, avatarUrl: this.awsService.getS3SignedUrl(user.avatar) };
  }
}
