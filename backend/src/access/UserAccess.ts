import { inject, injectable } from 'inversify';
import { User } from 'src/model/entity/User';
import { UserEntity } from 'src/model/entity/UserEntity';
import { Database } from 'src/util/Database';

/**
 * Access class for User model.
 */
@injectable()
export class UserAccess {
  @inject(Database)
  private readonly database!: Database;

  public async find() {
    const qr = await this.database.getQueryRunner();

    return await qr.manager.find<User>(UserEntity.name);
  }

  public async findOneById(id: string) {
    const qr = await this.database.getQueryRunner();

    return await qr.manager.findOne<User>(UserEntity.name, {
      where: { id },
    });
  }

  public async save(data: User) {
    const qr = await this.database.getQueryRunner();
    const entity = new UserEntity();
    Object.assign(entity, data);

    return await qr.manager.save(entity);
  }
}
