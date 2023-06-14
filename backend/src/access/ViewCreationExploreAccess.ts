import { inject, injectable } from 'inversify';
import { FindManyOptions } from 'typeorm';
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
      options
    );
  }
}
