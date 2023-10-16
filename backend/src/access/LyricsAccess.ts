import { inject, injectable } from 'inversify';
import { FindManyOptions } from 'typeorm';
import { Lyrics, LyricsEntity } from 'src/model/entity/LyricsEntity';
import { Database } from 'src/util/Database';

/**
 * Access class for Lyrics model.
 */
@injectable()
export class LyricsAccess {
  @inject(Database)
  private readonly database!: Database;

  public async find(options: FindManyOptions<Lyrics>) {
    const qr = await this.database.getQueryRunner();

    return await qr.manager.find<Lyrics>(LyricsEntity.name, {
      relations: { user: true, info: true },
      ...options,
    });
  }

  public async findOneById(id: string) {
    const qr = await this.database.getQueryRunner();

    return await qr.manager.findOne<Lyrics>(LyricsEntity.name, {
      where: { id },
    });
  }

  public async findOneOrFailById(id: string) {
    const qr = await this.database.getQueryRunner();

    return await qr.manager.findOneOrFail<Lyrics>(LyricsEntity.name, {
      where: { id },
    });
  }

  public async save(data: Lyrics) {
    const qr = await this.database.getQueryRunner();
    const entity = new LyricsEntity();
    Object.assign(entity, data);

    return await qr.manager.save(entity);
  }
}
