import { inject, injectable } from 'inversify';
import { FindOneOptions } from 'typeorm';
import {
  TrackHistory,
  TrackHistoryEntity,
} from 'src/model/entity/TrackHistoryEntity';
import { Database } from 'src/util/Database';

/**
 * Access class for Track History model.
 */
@injectable()
export class TrackHistoryAccess {
  @inject(Database)
  private readonly database!: Database;

  public async findOneOrFail(options: FindOneOptions<TrackHistory>) {
    const qr = await this.database.getQueryRunner();

    return await qr.manager.findOneOrFail<TrackHistory>(
      TrackHistoryEntity.name,
      {
        ...options,
      }
    );
  }

  public async save(data: TrackHistory) {
    const qr = await this.database.getQueryRunner();
    const entity = new TrackHistoryEntity();
    Object.assign(entity, data);

    return await qr.manager.save(entity);
  }
}
