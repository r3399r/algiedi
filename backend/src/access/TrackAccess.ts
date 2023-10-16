import { inject, injectable } from 'inversify';
import { FindManyOptions, FindOneOptions } from 'typeorm';
import { Track, TrackEntity } from 'src/model/entity/TrackEntity';
import { Database } from 'src/util/Database';

/**
 * Access class for Track model.
 */
@injectable()
export class TrackAccess {
  @inject(Database)
  private readonly database!: Database;

  public async find(options: FindManyOptions<Track>) {
    const qr = await this.database.getQueryRunner();

    return await qr.manager.find<Track>(TrackEntity.name, {
      relations: { user: true, info: true },
      ...options,
    });
  }

  public async findOneById(id: string) {
    const qr = await this.database.getQueryRunner();

    return await qr.manager.findOne<Track>(TrackEntity.name, {
      where: { id },
    });
  }

  public async findOneOrFailById(id: string) {
    const qr = await this.database.getQueryRunner();

    return await qr.manager.findOneOrFail<Track>(TrackEntity.name, {
      where: { id },
    });
  }

  public async findOne(options: FindOneOptions<Track>) {
    const qr = await this.database.getQueryRunner();

    return await qr.manager.findOne<Track>(TrackEntity.name, options);
  }

  public async findByProjectId(projectId: string) {
    const qr = await this.database.getQueryRunner();

    return await qr.manager.find<Track>(TrackEntity.name, {
      where: { projectId },
      order: { createdAt: 'desc' },
    });
  }

  public async save(data: Track) {
    const qr = await this.database.getQueryRunner();
    const entity = new TrackEntity();
    Object.assign(entity, data);

    return await qr.manager.save(entity);
  }
}
