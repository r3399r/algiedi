import { inject, injectable } from 'inversify';
import { ViewLyrics } from 'src/model/entity/ViewLyrics';
import { ViewLyricsEntity } from 'src/model/entity/ViewLyricsEntity';
import { Database } from 'src/util/Database';

/**
 * Access class for ViewLyrics model.
 */
@injectable()
export class ViewLyricsAccess {
  @inject(Database)
  private readonly database!: Database;

  public async findByProjectId(projectId: string) {
    const qr = await this.database.getQueryRunner();

    return await qr.manager.find<ViewLyrics>(ViewLyricsEntity.name, {
      where: { projectId },
      order: { createdAt: 'desc' },
    });
  }
}
