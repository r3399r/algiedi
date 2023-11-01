import { inject, injectable } from 'inversify';
import { FindManyOptions, FindOneOptions } from 'typeorm';
import { Follow, FollowEntity } from 'src/model/entity/FollowEntity';
import { Database } from 'src/util/Database';

/**
 * Access class for Follow model.
 */
@injectable()
export class FollowAccess {
  @inject(Database)
  private readonly database!: Database;

  public async find(options: FindManyOptions<Follow>) {
    const qr = await this.database.getQueryRunner();

    return await qr.manager.find<Follow>(FollowEntity.name, {
      relations: { followee: true, follower: true },
      ...options,
    });
  }

  public async findAndCount(options: FindManyOptions<Follow>) {
    const qr = await this.database.getQueryRunner();

    return await qr.manager.findAndCount<Follow>(FollowEntity.name, {
      relations: { followee: true, follower: true },
      ...options,
    });
  }

  public async findOneOrFail(options: FindOneOptions<Follow>) {
    const qr = await this.database.getQueryRunner();

    return await qr.manager.findOneOrFail<Follow>(FollowEntity.name, {
      relations: { followee: true, follower: true },
      ...options,
    });
  }

  public async hardDeleteById(id: string) {
    const qr = await this.database.getQueryRunner();

    return await qr.manager.delete(FollowEntity.name, { id });
  }

  public async save(data: Follow) {
    const qr = await this.database.getQueryRunner();
    const entity = new FollowEntity();
    Object.assign(entity, data);

    return await qr.manager.save(entity);
  }
}
