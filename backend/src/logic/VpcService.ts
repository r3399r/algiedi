import { inject, injectable } from 'inversify';
import { DbAccess } from 'src/access/DbAccess';
import { UserAccess } from 'src/access/UserAccess';
import { InternalServerError } from 'src/model/error';
import { InitUserEvent } from 'src/model/Lambda';

/**
 * Service class for Vpc
 */
@injectable()
export class VpcService {
  @inject(DbAccess)
  private readonly dbAccess!: DbAccess;

  @inject(UserAccess)
  private readonly userAccess!: UserAccess;

  public async cleanup() {
    await this.dbAccess.cleanup();
  }

  public async initUser(data: InitUserEvent['data']) {
    const user = await this.userAccess.findOneById(data.id);
    if (user === null) throw new InternalServerError('unexpected error');
    user.role = data.role;
    user.language = data.language;
    user.bio = data.bio;
    user.tag = data.tag;

    await this.userAccess.save(user);
  }
}
