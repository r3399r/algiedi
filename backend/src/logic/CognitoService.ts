import { inject, injectable } from 'inversify';
import { DbAccess } from 'src/access/DbAccess';
import { UserAccess } from 'src/access/UserAccess';
import { UserEntity } from 'src/model/entity/UserEntity';

/**
 * Service class for Cognito
 */
@injectable()
export class CognitoService {
  @inject(DbAccess)
  private readonly dbAccess!: DbAccess;

  @inject(UserAccess)
  private readonly userAccess!: UserAccess;

  public async cleanup() {
    await this.dbAccess.cleanup();
  }

  public async addUser(id: string, email: string, username: string) {
    const user = new UserEntity();
    user.id = id;
    user.email = email;
    user.username = username;

    await this.userAccess.save(user);
  }
}
