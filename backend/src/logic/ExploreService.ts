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
    const inspired = creation.inspiredId
      ? await this.viewCreationExploreAccess.findOneByIdOrFail(
          creation.inspiredId
        )
      : null;
    const inspiration = await this.viewCreationExploreAccess.find({
      where: { inspiredId: id },
    });

    return {
      ...creation,
      fileUrl: this.awsService.getS3SignedUrl(creation.fileUri),
      tabFileUrl: this.awsService.getS3SignedUrl(creation.tabFileUri),
      coverFileUrl: this.awsService.getS3SignedUrl(creation.coverFileUri),
      user,
      inspired: inspired
        ? {
            ...inspired,
            fileUrl: this.awsService.getS3SignedUrl(inspired.fileUri),
            tabFileUrl: this.awsService.getS3SignedUrl(inspired.tabFileUri),
            coverFileUrl: this.awsService.getS3SignedUrl(inspired.coverFileUri),
          }
        : null,
      inspiration: inspiration.map((v) => ({
        ...v,
        fileUrl: this.awsService.getS3SignedUrl(v.fileUri),
        tabFileUrl: this.awsService.getS3SignedUrl(v.tabFileUri),
        coverFileUrl: this.awsService.getS3SignedUrl(v.coverFileUri),
      })),
    };
  }
}
