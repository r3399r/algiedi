import { inject, injectable } from 'inversify';
import { Track } from 'src/model/entity/Track';
import { TrackEntity } from 'src/model/entity/TrackEntity';
import { Database } from 'src/util/Database';

/**
 * Access class for Track model.
 */
@injectable()
export class TrackAccess {
  @inject(Database)
  private readonly database!: Database;

  public async find() {
    const qr = await this.database.getQueryRunner();

    return await qr.manager.find<Track>(TrackEntity.name);
  }

  public async findByUserId(userId: string) {
    const qr = await this.database.getQueryRunner();

    return await qr.manager.find<Track>(TrackEntity.name, {
      where: { userId },
      order: { createdAt: 'asc' },
    });
  }

  public async save(data: Track) {
    const qr = await this.database.getQueryRunner();
    const entity = new TrackEntity();
    Object.assign(entity, data);

    return await qr.manager.save(entity);
  }
}
