import { inject, injectable } from 'inversify';
import { DbAccess } from 'src/access/DbAccess';
import { UserAccess } from 'src/access/UserAccess';
import { GetMeResponse, PutMeRequest, PutMeResponse } from 'src/model/api/Me';
import { InternalServerError } from 'src/model/error';
import { cognitoSymbol } from 'src/util/LambdaSetup';

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

  public async cleanup() {
    await this.dbAccess.cleanup();
  }

  public async getMe(): Promise<GetMeResponse> {
    const user = await this.userAccess.findOneById(this.cognitoUserId);
    if (user === null) throw new InternalServerError('user not found');

    return user;
  }

  public async updateMe(data: PutMeRequest): Promise<PutMeResponse> {
    const user = await this.userAccess.findOneById(this.cognitoUserId);
    if (user === null) throw new InternalServerError('user not found');

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

    return user;
  }
}
