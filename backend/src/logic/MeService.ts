import { inject, injectable } from 'inversify';
import { DbAccess } from 'src/access/DbAccess';
import { UserAccess } from 'src/access/UserAccess';
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

  public async getMe() {
    const user = await this.userAccess.findOneById(this.cognitoUserId);
    if (user === null) throw new InternalServerError('user not found');

    return user;
  }
}
