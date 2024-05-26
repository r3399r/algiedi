import { inject, injectable } from 'inversify';
import { FindManyOptions, FindOneOptions } from 'typeorm';
import {
  ViewCreationExplore,
  ViewCreationExploreEntity,
} from 'src/model/entity/ViewCreationExploreEntity';
import { Database } from 'src/util/Database';

/**
 * Access class for ViewCreationExplore model.
 */
@injectable()
export class ViewCreationExploreAccess {
  @inject(Database)
  private readonly database!: Database;

  public async find(options?: FindManyOptions<ViewCreationExplore>) {
    const qr = await this.database.getQueryRunner();

    return await qr.manager.find<ViewCreationExplore>(
      ViewCreationExploreEntity.name,
      {
        relations: { info: { caption: true }, project: true, user: true },
        ...options,
      }
    );
  }

  public async findAndCount(options?: FindManyOptions<ViewCreationExplore>) {
    const qr = await this.database.getQueryRunner();

    return await qr.manager.findAndCount<ViewCreationExplore>(
      ViewCreationExploreEntity.name,
      {
        relations: { info: { caption: true }, project: true, user: true },
        ...options,
      }
    );
  }

  public async findOneOrFail(options?: FindOneOptions<ViewCreationExplore>) {
    const qr = await this.database.getQueryRunner();

    return await qr.manager.findOneOrFail<ViewCreationExplore>(
      ViewCreationExploreEntity.name,
      {
        relations: { info: { caption: true }, project: true, user: true },
        ...options,
      }
    );
  }

  public async findOneByIdOrFail(id: string) {
    return await this.findOneOrFail({ where: { id } });
  }
}
