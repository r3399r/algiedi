import { inject, injectable } from 'inversify';
import { FindManyOptions, FindOneOptions } from 'typeorm';
import {
  ProjectHistory,
  ProjectHistoryEntity,
} from 'src/model/entity/ProjectHistoryEntity';
import { Database } from 'src/util/Database';

/**
 * Access class for Project History model.
 */
@injectable()
export class ProjectHistoryAccess {
  @inject(Database)
  private readonly database!: Database;

  public async find(options: FindManyOptions<ProjectHistory>) {
    const qr = await this.database.getQueryRunner();

    return await qr.manager.find<ProjectHistory>(
      ProjectHistoryEntity.name,
      options
    );
  }

  public async findOne(options: FindOneOptions<ProjectHistory>) {
    const qr = await this.database.getQueryRunner();

    return await qr.manager.findOne<ProjectHistory>(ProjectHistoryEntity.name, {
      ...options,
    });
  }

  public async findOneOrFail(options: FindOneOptions<ProjectHistory>) {
    const qr = await this.database.getQueryRunner();

    return await qr.manager.findOneOrFail<ProjectHistory>(
      ProjectHistoryEntity.name,
      {
        ...options,
      }
    );
  }

  public async save(data: ProjectHistory) {
    const qr = await this.database.getQueryRunner();
    const entity = new ProjectHistoryEntity();
    Object.assign(entity, data);

    return await qr.manager.save(entity);
  }
}
