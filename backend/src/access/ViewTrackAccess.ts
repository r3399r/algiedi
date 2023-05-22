import { inject, injectable } from 'inversify';
import { ViewTrack } from 'src/model/entity/ViewTrack';
import { ViewTrackEntity } from 'src/model/entity/ViewTrackEntity';
import { Database } from 'src/util/Database';

/**
 * Access class for ViewTrack model.
 */
@injectable()
export class ViewTrackAccess {
  @inject(Database)
  private readonly database!: Database;

  public async findByProjectId(projectId: string) {
    const qr = await this.database.getQueryRunner();

    return await qr.manager.find<ViewTrack>(ViewTrackEntity.name, {
      where: { projectId },
      order: { createdAt: 'desc' },
    });
  }
}
