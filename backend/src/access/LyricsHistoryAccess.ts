import { inject, injectable } from 'inversify';
import {
  LyricsHistory,
  LyricsHistoryEntity,
} from 'src/model/entity/LyricsHistoryEntity';
import { Database } from 'src/util/Database';

/**
 * Access class for Lyrics History model.
 */
@injectable()
export class LyricsHistoryAccess {
  @inject(Database)
  private readonly database!: Database;

  public async save(data: LyricsHistory) {
    const qr = await this.database.getQueryRunner();
    const entity = new LyricsHistoryEntity();
    Object.assign(entity, data);

    return await qr.manager.save(entity);
  }
}
