import { inject, injectable } from 'inversify';
import { ViewProjectUser } from 'src/model/entity/ViewProjectUser';
import { ViewProjectUserEntity } from 'src/model/entity/ViewProjectUserEntity';
import { Database } from 'src/util/Database';

/**
 * Access class for ViewProjectUser model.
 */
@injectable()
export class ViewProjectUserAccess {
  @inject(Database)
  private readonly database!: Database;

  public async find() {
    const qr = await this.database.getQueryRunner();

    return await qr.manager.find<ViewProjectUser>(ViewProjectUserEntity.name);
  }

  public async findByUserId(userId: string) {
    const qr = await this.database.getQueryRunner();

    return await qr.manager.find<ViewProjectUser>(ViewProjectUserEntity.name, {
      where: { userId },
    });
  }
}
