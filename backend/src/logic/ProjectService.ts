import { S3 } from 'aws-sdk';
import { inject, injectable } from 'inversify';
import { DbAccess } from 'src/access/DbAccess';
import { LyricsAccess } from 'src/access/LyricsAccess';
import { ProjectAccess } from 'src/access/ProjectAccess';
import { TrackAccess } from 'src/access/TrackAccess';
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

  public async getProject() {
    const project = await this.projectAccess.findByUserId(this.cognitoUserId);
    const lyrics = await this.lyricsAccess.findByUserId(this.cognitoUserId);
    const track = await this.trackAccess.findByUserId(this.cognitoUserId);
    const bucket = `${process.env.PROJECT}-${process.env.ENVR}-storage`;

    const url =
      track.length > 0
        ? this.s3.getSignedUrl('getObject', {
            Bucket: bucket,
            Key: track[0].fileUri,
          })
        : '';

    return { project, lyrics, track, url };
  }
}
