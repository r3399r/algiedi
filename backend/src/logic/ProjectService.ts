import { S3 } from 'aws-sdk';
import { inject, injectable } from 'inversify';
import { DbAccess } from 'src/access/DbAccess';
import { LyricsAccess } from 'src/access/LyricsAccess';
import { TrackAccess } from 'src/access/TrackAccess';
import { ViewLyricsAccess } from 'src/access/ViewLyricsAccess';
import { ViewProjectUserAccess } from 'src/access/ViewProjectUserAccess';
import { ViewTrackAccess } from 'src/access/ViewTrackAccess';
import { GetProjectResponse, PutProjectRequest } from 'src/model/api/Project';
import { Project } from 'src/model/entity/Project';
import { BadRequestError, UnauthorizedError } from 'src/model/error';
import { DetailedLyrics, DetailedTrack } from 'src/model/Project';
import { compare } from 'src/util/compare';
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

  @inject(ViewProjectUserAccess)
  private readonly viewProjectUserAccess!: ViewProjectUserAccess;

  @inject(ViewTrackAccess)
  private readonly viewTrackAccess!: ViewTrackAccess;

  @inject(ViewLyricsAccess)
  private readonly viewLyricsAccess!: ViewLyricsAccess;

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
    const projectUserPairs = await this.viewProjectUserAccess.findByUserId(
      this.cognitoUserId
    );
    const projects: Project[] = projectUserPairs.map((v) => ({
      id: v.projectId,
      status: v.status,
      createdAt: v.createdAt,
      updatedAt: v.updatedAt,
    }));

    return await Promise.all(
      projects.map(async (p) => {
        const lyrics = await this.viewLyricsAccess.findByProjectId(p.id);
        const track = await this.viewTrackAccess.findByProjectId(p.id);

        const detailedLyrics: DetailedLyrics[] = lyrics.map((l) => ({
          ...l,
          type: 'lyrics',
          coverFileUrl: this.getS3SignedUrl(l.coverFileUri),
        }));
        const detailedTrack: DetailedTrack[] = track.map((t) => ({
          ...t,
          type: 'track',
          fileUrl: this.getS3SignedUrl(t.fileUri),
          tabFileUrl: this.getS3SignedUrl(t.tabFileUri),
          coverFileUrl: this.getS3SignedUrl(t.coverFileUri),
        }));

        return {
          ...p,
          creation: [...detailedLyrics, ...detailedTrack].sort(
            compare('createdAt')
          ),
        };
      })
    );
  }

  public async updateProject(
    id: string,
    data: PutProjectRequest
  ): Promise<void> {
    const lyrics = await this.lyricsAccess.findOne({
      where: {
        projectId: id,
        isOriginal: true,
      },
    });
    const track = await this.trackAccess.findOne({
      where: {
        projectId: id,
        isOriginal: true,
      },
    });
    if (lyrics === null && track !== null) {
      if (track.userId !== this.cognitoUserId)
        throw new UnauthorizedError('Only owner can edit');
      track.name = data.name ?? track.name;
      track.description = data.description ?? track.description;
      track.theme = data.theme ?? track.theme;
      track.genre = data.genre ?? track.genre;
      track.language = data.language ?? track.language;
      track.caption = data.caption ?? track.caption;
      await this.trackAccess.save(track);
    } else if (lyrics !== null && track === null) {
      if (lyrics.userId !== this.cognitoUserId)
        throw new UnauthorizedError('Only owner can edit');
      lyrics.name = data.name ?? lyrics.name;
      lyrics.description = data.description ?? lyrics.description;
      lyrics.theme = data.theme ?? lyrics.theme;
      lyrics.genre = data.genre ?? lyrics.genre;
      lyrics.language = data.language ?? lyrics.language;
      lyrics.caption = data.caption ?? lyrics.caption;
      await this.lyricsAccess.save(lyrics);
    }
    throw new BadRequestError('unexpected error');
  }
}
