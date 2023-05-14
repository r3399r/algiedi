import { inject, injectable } from 'inversify';
import { Lyrics } from 'src/model/entity/Lyrics';
import { LyricsEntity } from 'src/model/entity/LyricsEntity';
import { Database } from 'src/util/Database';

/**
 * Access class for Lyrics model.
 */
@injectable()
export class LyricsAccess {
  @inject(Database)
  private readonly database!: Database;

  public async find() {
    const qr = await this.database.getQueryRunner();

    return await qr.manager.find<Lyrics>(LyricsEntity.name);
  }

  public async findByProjectId(projectId: string) {
    const qr = await this.database.getQueryRunner();

    return await qr.manager.find<Lyrics>(LyricsEntity.name, {
      where: { projectId },
      order: { createdAt: 'desc' },
    });
  }

  public async save(data: Lyrics) {
    const qr = await this.database.getQueryRunner();
    const entity = new LyricsEntity();
    Object.assign(entity, data);

    return await qr.manager.save(entity);
  }
}
