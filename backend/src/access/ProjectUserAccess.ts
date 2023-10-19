import { inject, injectable } from 'inversify';
import { FindManyOptions, FindOneOptions } from 'typeorm';
import {
  ProjectUser,
  ProjectUserEntity,
} from 'src/model/entity/ProjectUserEntity';
import { Database } from 'src/util/Database';

/**
 * Access class for ProjectUser model.
 */
@injectable()
export class ProjectUserAccess {
  @inject(Database)
  private readonly database!: Database;

  public async find(options?: FindManyOptions<ProjectUser>) {
    const qr = await this.database.getQueryRunner();

    return await qr.manager.find<ProjectUser>(ProjectUserEntity.name, {
      relations: {
        project: { info: true },
        user: true,
        lyrics: { info: true },
        track: { info: true },
      },
      ...options,
    });
  }

  public async findByProjectId(projectId: string) {
    return this.find({
      where: { projectId },
      order: { createdAt: 'asc' },
    });
  }

  public async findByUserId(userId: string) {
    return this.find({
      where: { userId },
      order: { createdAt: 'desc' },
    });
  }

  public async findOne(options: FindOneOptions<ProjectUser>) {
    const qr = await this.database.getQueryRunner();

    return await qr.manager.findOne<ProjectUser>(
      ProjectUserEntity.name,
      options
    );
  }

  public async findOneOrFail(options: FindOneOptions<ProjectUser>) {
    const qr = await this.database.getQueryRunner();

    return await qr.manager.findOneOrFail<ProjectUser>(
      ProjectUserEntity.name,
      options
    );
  }

  public async save(data: ProjectUser) {
    const qr = await this.database.getQueryRunner();
    const entity = new ProjectUserEntity();
    Object.assign(entity, data);

    return await qr.manager.save(entity);
  }
}
