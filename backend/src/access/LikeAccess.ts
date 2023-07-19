import { inject, injectable } from 'inversify';
import { FindManyOptions, FindOneOptions } from 'typeorm';
import { Like, LikeEntity } from 'src/model/entity/LikeEntity';
import { Database } from 'src/util/Database';

/**
 * Access class for Like model.
 */
@injectable()
export class LikeAccess {
  @inject(Database)
  private readonly database!: Database;

  public async find(options: FindManyOptions<Like>) {
    const qr = await this.database.getQueryRunner();

    return await qr.manager.find<Like>(LikeEntity.name, options);
  }

  public async findOneOrFail(options: FindOneOptions<Like>) {
    const qr = await this.database.getQueryRunner();

    return await qr.manager.findOneOrFail<Like>(LikeEntity.name, options);
  }

  public async hardDeleteById(id: string) {
    const qr = await this.database.getQueryRunner();

    return await qr.manager.delete(LikeEntity.name, { id });
  }

  public async save(data: Like) {
    const qr = await this.database.getQueryRunner();
    const entity = new LikeEntity();
    Object.assign(entity, data);

    return await qr.manager.save(entity);
  }
}
