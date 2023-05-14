import { S3 } from 'aws-sdk';
import { inject, injectable } from 'inversify';
import { DbAccess } from 'src/access/DbAccess';
import { LyricsAccess } from 'src/access/LyricsAccess';
import { ProjectAccess } from 'src/access/ProjectAccess';
import { TrackAccess } from 'src/access/TrackAccess';
import { GetProjectResponse } from 'src/model/api/Project';
import { cognitoSymbol } from 'src/util/LambdaSetup';

/**
 * Service class for Project
 */
@injectable()
export class ProjectService {
  @inject(cognitoSymbol)
  private readonly cognitoUserId!: string;

  @inject(S3)
  private readonly s3!: S3;

  @inject(DbAccess)
  private readonly dbAccess!: DbAccess;

  @inject(LyricsAccess)
  private readonly lyricsAccess!: LyricsAccess;

  @inject(TrackAccess)
  private readonly trackAccess!: TrackAccess;

  @inject(ProjectAccess)
  private readonly projectAccess!: ProjectAccess;

  public async cleanup() {
    await this.dbAccess.cleanup();
  }

  private getS3SignedUrl(uri: string | null) {
    const bucket = `${process.env.PROJECT}-${process.env.ENVR}-storage`;

    return uri === null
      ? null
      : this.s3.getSignedUrl('getObject', {
          Bucket: bucket,
          Key: uri,
        });
  }

  public async getProjects(): Promise<GetProjectResponse> {
    const projects = await this.projectAccess.findByUserId(this.cognitoUserId);

    return await Promise.all(
      projects.map(async (p) => {
        const lyrics = await this.lyricsAccess.findByProjectId(p.id);
        const track = await this.trackAccess.findByProjectId(p.id);

        return {
          ...p,
          coverFileUrl: this.getS3SignedUrl(p.coverFileUri),
          lyrics,
          track: track.map((t) => ({
            ...t,
            fileUrl: this.getS3SignedUrl(t.fileUri),
            tabFileUrl: this.getS3SignedUrl(t.tabFileUri),
          })),
        };
      })
    );
  }
}
