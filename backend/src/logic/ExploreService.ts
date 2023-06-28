import { inject, injectable } from 'inversify';
import { DbAccess } from 'src/access/DbAccess';
import { UserAccess } from 'src/access/UserAccess';
import { ViewCreationExploreAccess } from 'src/access/ViewCreationExploreAccess';
import {
  GetExploreIdResponse,
  GetExploreResponse,
} from 'src/model/api/Explore';
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

  @inject(UserAccess)
  private readonly userAccess!: UserAccess;

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

  public async getExploreById(id: string): Promise<GetExploreIdResponse> {
    const creation = await this.viewCreationExploreAccess.findOneByIdOrFail(id);
    const user = await this.userAccess.findOneByIdOrFail(creation.userId);

    return {
      ...creation,
      fileUrl: this.awsService.getS3SignedUrl(creation.fileUri),
      tabFileUrl: this.awsService.getS3SignedUrl(creation.tabFileUri),
      coverFileUrl: this.awsService.getS3SignedUrl(creation.coverFileUri),
      user,
    };
  }
}
