import { inject, injectable } from 'inversify';
import { FindOneOptions } from 'typeorm';
import {
  ViewCreation,
  ViewCreationEntity,
} from 'src/model/entity/ViewCreationEntity';
import { Database } from 'src/util/Database';

/**
 * Access class for ViewCreation model.
 */
@injectable()
export class ViewCreationAccess {
  @inject(Database)
  private readonly database!: Database;

  public async findOneById(id: string) {
    const qr = await this.database.getQueryRunner();

    return await qr.manager.findOne<ViewCreation>(ViewCreationEntity.name, {
      where: { id },
    });
  }

  public async findByUserId(userId: string) {
    const qr = await this.database.getQueryRunner();

    return await qr.manager.find<ViewCreation>(ViewCreationEntity.name, {
      where: { userId },
    });
  }

  public async findByProjectId(projectId: string) {
    const qr = await this.database.getQueryRunner();

    return await qr.manager.find<ViewCreation>(ViewCreationEntity.name, {
      where: { projectId },
    });
  }

  public async findOne(options: FindOneOptions<ViewCreation>) {
    const qr = await this.database.getQueryRunner();

    return await qr.manager.findOne<ViewCreation>(
      ViewCreationEntity.name,
      options
    );
  }
}
