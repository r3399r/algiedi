import { inject, injectable } from 'inversify';
import { FindManyOptions, FindOneOptions, In } from 'typeorm';
import { User, UserEntity } from 'src/model/entity/UserEntity';
import { Database } from 'src/util/Database';

/**
 * Access class for User model.
 */
@injectable()
export class UserAccess {
  @inject(Database)
  private readonly database!: Database;

  public async find(options: FindManyOptions<User>) {
    const qr = await this.database.getQueryRunner();

    return await qr.manager.find<User>(UserEntity.name, options);
  }

  public async findAndCount(options: {
    keyword: string;
    role?: string[];
    take?: number;
    skip?: number;
  }): Promise<[User[], number]> {
    const qr = await this.database.getQueryRunner();

    const queryBuilder = qr.manager
      .createQueryBuilder(UserEntity.name, 'u')
      .select('u.id')
      .where(`u.username LIKE "%${options.keyword}%"`);

    if (options.role)
      for (const r of options.role)
        queryBuilder.andWhere(`u.role LIKE "%${r}%"`);

    queryBuilder.take(options.take).skip(options.skip);

    const [id, count] = await queryBuilder.getManyAndCount();

    return [await this.find({ where: { id: In(id.map((v) => v.id)) } }), count];
  }

  public async findOneOrFail(options: FindOneOptions<User>) {
    const qr = await this.database.getQueryRunner();

    return await qr.manager.findOneOrFail<User>(UserEntity.name, options);
  }

  public async findOneByIdOrFail(id: string) {
    return await this.findOneOrFail({
      where: { id },
    });
  }

  public async findOneByConnectionIdOrFail(connectionId: string) {
    return await this.findOneOrFail({
      where: { connectionId },
    });
  }

  public async save(data: User) {
    const qr = await this.database.getQueryRunner();
    const entity = new UserEntity();
    Object.assign(entity, data);

    return await qr.manager.save(entity);
  }
}
