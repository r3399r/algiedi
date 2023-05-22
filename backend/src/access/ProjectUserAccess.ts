import { inject, injectable } from 'inversify';
import { ProjectUser } from 'src/model/entity/ProjectUser';
import { ProjectUserEntity } from 'src/model/entity/ProjectUserEntity';
import { Database } from 'src/util/Database';

/**
 * Access class for ProjectUser model.
 */
@injectable()
export class ProjectUserAccess {
  @inject(Database)
  private readonly database!: Database;

  public async findByUserId(userId: string) {
    const qr = await this.database.getQueryRunner();

    return await qr.manager.find<ProjectUser>(ProjectUserEntity.name, {
      where: { userId },
    });
  }

  public async save(data: ProjectUser) {
    const qr = await this.database.getQueryRunner();
    const entity = new ProjectUserEntity();
    Object.assign(entity, data);

    return await qr.manager.save(entity);
  }
}
