import { inject, injectable } from 'inversify';
import { FindManyOptions, FindOneOptions, In } from 'typeorm';
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

  public async findAndCount(options: {
    followerId: string;
    take: number;
    skip: number;
    role?: string[];
  }): Promise<[Follow[], number]> {
    const qr = await this.database.getQueryRunner();

    const queryBuilder = qr.manager
      .createQueryBuilder(FollowEntity.name, 'f')
      .select('f.id')
      .innerJoin('user', 'u', 'f.followee_id = u.id')
      .where('f.followerId = :followerId', { followerId: options.followerId });

    if (options.role)
      for (const r of options.role)
        queryBuilder.andWhere(`u.role LIKE "%${r}%"`);

    queryBuilder.take(options.take).skip(options.skip);

    const [id, count] = await queryBuilder.getManyAndCount();

    return [await this.find({ where: { id: In(id.map((v) => v.id)) } }), count];
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
