import { inject, injectable } from 'inversify';
import { Song, SongEntity } from 'src/model/entity/SongEntity';
import { Database } from 'src/util/Database';

/**
 * Access class for Song model.
 */
@injectable()
export class SongAccess {
  @inject(Database)
  private readonly database!: Database;

  public async save(data: Song) {
    const qr = await this.database.getQueryRunner();
    const entity = new SongEntity();
    Object.assign(entity, data);

    return await qr.manager.save(entity);
  }
}
