import { inject, injectable } from 'inversify';
import { In } from 'typeorm';
import { Project, ProjectEntity } from 'src/model/entity/ProjectEntity';
import { Database } from 'src/util/Database';

/**
 * Access class for Project model.
 */
@injectable()
export class ProjectAccess {
  @inject(Database)
  private readonly database!: Database;

  public async find() {
    const qr = await this.database.getQueryRunner();

    return await qr.manager.find<Project>(ProjectEntity.name);
  }

  public async findOneByIdOrFail(id: string) {
    const qr = await this.database.getQueryRunner();

    return await qr.manager.findOneOrFail<Project>(ProjectEntity.name, {
      where: { id },
    });
  }

  public async findByIds(ids: string[]) {
    const qr = await this.database.getQueryRunner();

    return await qr.manager.find<Project>(ProjectEntity.name, {
      where: { id: In(ids) },
      order: { createdAt: 'asc' },
    });
  }

  public async save(data: Project) {
    const qr = await this.database.getQueryRunner();
    const entity = new ProjectEntity();
    Object.assign(entity, data);

    return await qr.manager.save(entity);
  }
}
