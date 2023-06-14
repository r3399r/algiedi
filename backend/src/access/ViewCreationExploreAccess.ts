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

  public async findOneById(id: string) {
    const qr = await this.database.getQueryRunner();

    return await qr.manager.findOne<ViewCreationExplore>(
      ViewCreationExploreEntity.name,
      {
        where: { id },
      }
    );
  }

  public async findByUserId(userId: string) {
    const qr = await this.database.getQueryRunner();

    return await qr.manager.find<ViewCreationExplore>(
      ViewCreationExploreEntity.name,
      {
        where: { userId },
      }
    );
  }

  public async findByProjectId(projectId: string) {
    const qr = await this.database.getQueryRunner();

    return await qr.manager.find<ViewCreationExplore>(
      ViewCreationExploreEntity.name,
      {
        where: { projectId },
      }
    );
  }

  public async findOne(options: FindOneOptions<ViewCreationExplore>) {
    const qr = await this.database.getQueryRunner();

    return await qr.manager.findOne<ViewCreationExplore>(
      ViewCreationExploreEntity.name,
      options
    );
  }

  public async find(options: FindManyOptions<ViewCreationExplore>) {
    const qr = await this.database.getQueryRunner();

    return await qr.manager.find<ViewCreationExplore>(
      ViewCreationExploreEntity.name,
      options
    );
  }
}
