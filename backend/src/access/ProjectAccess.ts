import { inject, injectable } from 'inversify';
import { Project } from 'src/model/entity/Project';
import { ProjectEntity } from 'src/model/entity/ProjectEntity';
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

  public async save(data: Project) {
    const qr = await this.database.getQueryRunner();
    const entity = new ProjectEntity();
    Object.assign(entity, data);

    return await qr.manager.save(entity);
  }
}