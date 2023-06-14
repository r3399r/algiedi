import { inject, injectable } from 'inversify';
import { DbAccess } from 'src/access/DbAccess';
import { ViewCreationExploreAccess } from 'src/access/ViewCreationExploreAccess';
import { GetExploreResponse } from 'src/model/api/Explore';
import { AwsService } from './AwsService';

/**
 * Service class for Explore
 */
@injectable()
export class ExploreService {
  @inject(DbAccess)
  private readonly dbAccess!: DbAccess;

  @inject(AwsService)
  private readonly awsService!: AwsService;

  @inject(ViewCreationExploreAccess)
  private readonly viewCreationExploreAccess!: ViewCreationExploreAccess;

  public async cleanup() {
    await this.dbAccess.cleanup();
  }

  public async getExplore(): Promise<GetExploreResponse> {
    const creations = await this.viewCreationExploreAccess.find();

    return creations.map((c) => ({
      ...c,
      fileUrl: this.awsService.getS3SignedUrl(c.fileUri),
      tabFileUrl: this.awsService.getS3SignedUrl(c.tabFileUri),
      coverFileUrl: this.awsService.getS3SignedUrl(c.coverFileUri),
    }));
  }
}
