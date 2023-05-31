import { inject, injectable } from 'inversify';
import { DbAccess } from 'src/access/DbAccess';
import { LyricsAccess } from 'src/access/LyricsAccess';
import { ProjectAccess } from 'src/access/ProjectAccess';
import { TrackAccess } from 'src/access/TrackAccess';
import { ViewCreationAccess } from 'src/access/ViewCreationAccess';
import {
  PostUploadRequest,
  PostUploadResponse,
  PutUploadIdCoverRequest,
  UploadLyrics,
  UploadTrack,
} from 'src/model/api/Upload';
import { Type } from 'src/model/constant/Creation';
import { Status } from 'src/model/constant/Project';
import { LyricsEntity } from 'src/model/entity/LyricsEntity';
import { Project, ProjectEntity } from 'src/model/entity/ProjectEntity';
import { TrackEntity } from 'src/model/entity/TrackEntity';
import {
  BadRequestError,
  InternalServerError,
  UnauthorizedError,
} from 'src/model/error';
import { cognitoSymbol } from 'src/util/LambdaSetup';
import { AwsService } from './AwsService';

/**
 * Service class for Uplaod
 */
@injectable()
export class UploadService {
  @inject(cognitoSymbol)
  private readonly cognitoUserId!: string;

  @inject(AwsService)
  private readonly awsService!: AwsService;

  @inject(DbAccess)
  private readonly dbAccess!: DbAccess;

  @inject(LyricsAccess)
  private readonly lyricsAccess!: LyricsAccess;

  @inject(TrackAccess)
  private readonly trackAccess!: TrackAccess;

  @inject(ProjectAccess)
  private readonly projectAccess!: ProjectAccess;

  @inject(ViewCreationAccess)
  private readonly viewCreationAccess!: ViewCreationAccess;

  public async cleanup() {
    await this.dbAccess.cleanup();
  }

  private async uploadLyrics(data: UploadLyrics, projectId: string) {
    const lyrics = new LyricsEntity();
    lyrics.userId = this.cognitoUserId;
    lyrics.name = data.name;
    lyrics.description = data.description;
    lyrics.theme = data.theme;
    lyrics.genre = data.genre;
    lyrics.language = data.language;
    lyrics.caption = data.caption;
    lyrics.lyrics = data.lyrics;
    lyrics.projectId = projectId;
    lyrics.isOriginal = data.isOriginal;
    lyrics.inspiredId = data.inspiredId;
    lyrics.approval = false;

    const newLyrics = await this.lyricsAccess.save(lyrics);

    // upload coverfile if exists
    if (data.coverFile) {
      const key = await this.awsService.s3Upload(
        data.coverFile,
        `lyrics/${newLyrics.id}/cover`
      );
      newLyrics.coverFileUri = key;
      await this.lyricsAccess.save(newLyrics);
    }
  }

  private async uploadTrack(data: UploadTrack, projectId: string) {
    const track = new TrackEntity();
    track.userId = this.cognitoUserId;
    track.name = data.name;
    track.description = data.description;
    track.theme = data.theme;
    track.genre = data.genre;
    track.language = data.language;
    track.caption = data.caption;
    track.projectId = projectId;
    track.isOriginal = data.isOriginal;
    track.inspiredId = data.inspiredId;
    track.approval = false;

    const newTrack = await this.trackAccess.save(track);

    // upload file
    const fileKey = await this.awsService.s3Upload(
      data.file,
      `track/${newTrack.id}/file`
    );

    // upload tab file if exists
    let tabFileKey: string | null = null;
    if (data.tabFile)
      tabFileKey = await this.awsService.s3Upload(
        data.tabFile,
        `track/${newTrack.id}/tab`
      );

    // upload coverfile if exists
    let coverFileKey: string | null = null;
    if (data.coverFile)
      coverFileKey = await this.awsService.s3Upload(
        data.coverFile,
        `track/${newTrack.id}/cover`
      );

    newTrack.fileUri = fileKey;
    newTrack.tabFileUri = tabFileKey;
    newTrack.coverFileUri = coverFileKey;
    await this.trackAccess.save(newTrack);
  }

  public async upload(data: PostUploadRequest): Promise<PostUploadResponse> {
    try {
      await this.dbAccess.startTransaction();

      // TODO: should check if inspired project completed or not
      let project: Project | null = null;

      // find old project if inspired, or create new project if no inspired
      if (data.inspiredId !== null) {
        // TODO: should findById instead of name
        const inspiredCreation = await this.viewCreationAccess.findOne({
          where: { name: data.inspiredId },
        });
        if (inspiredCreation === null)
          throw new BadRequestError('track/lyrics not found');
        project = {
          id: inspiredCreation.projectId,
          status: inspiredCreation.projectStatus,
          createdAt: inspiredCreation.projectCreatedAt,
          updatedAt: inspiredCreation.projectUpdatedAt,
        };

        // check if user participates or not
        const userCreations = await this.viewCreationAccess.find({
          where: { userId: this.cognitoUserId, projectId: project.id },
        });
        if (userCreations.length > 0)
          for (const c of userCreations) {
            if (c.type === Type.Lyrics && data.type === 'lyrics')
              throw new BadRequestError('Already participated with lyrics');
            if (c.type === Type.Track && data.type === 'track')
              throw new BadRequestError('Already participated with a track');
          }
      } else {
        const tmpProject = new ProjectEntity();
        tmpProject.status = Status.Created;

        const newProject = await this.projectAccess.save(tmpProject);
        project = newProject;
      }

      if (project === null) throw new BadRequestError('project not found');

      if (data.type === 'lyrics') await this.uploadLyrics(data, project.id);
      else if (data.type === 'track') await this.uploadTrack(data, project.id);

      await this.dbAccess.commitTransaction();

      return project;
    } catch (e) {
      await this.dbAccess.rollbackTransaction();
      throw e;
    }
  }

  public async updateCover(creationId: string, data: PutUploadIdCoverRequest) {
    const creations = await this.viewCreationAccess.findOneById(creationId);
    if (creations === null || creations.userId !== this.cognitoUserId)
      throw new UnauthorizedError('only owner can edit cover');

    if (creations.type === Type.Track) {
      const track = await this.trackAccess.findOneById(creationId);
      if (track === null) throw new InternalServerError('track not found');

      const key = await this.awsService.s3Upload(
        data.file,
        `track/${track.id}/cover`
      );
      if (track.coverFileUri === null) {
        track.coverFileUri = key;
        await this.trackAccess.save(track);
      }
    } else if (creations.type === Type.Lyrics) {
      const lyrics = await this.lyricsAccess.findOneById(creationId);
      if (lyrics === null) throw new InternalServerError('lyrics not found');

      const key = await this.awsService.s3Upload(
        data.file,
        `lyrics/${lyrics.id}/cover`
      );
      if (lyrics.coverFileUri === null) {
        lyrics.coverFileUri = key;
        await this.lyricsAccess.save(lyrics);
      }
    } else throw new InternalServerError('creation not found');
  }
}
