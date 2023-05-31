import { inject, injectable } from 'inversify';
import { DbAccess } from 'src/access/DbAccess';
import { LyricsAccess } from 'src/access/LyricsAccess';
import { ProjectAccess } from 'src/access/ProjectAccess';
import { ProjectUserAccess } from 'src/access/ProjectUserAccess';
import { TrackAccess } from 'src/access/TrackAccess';
import { ViewCreationAccess } from 'src/access/ViewCreationAccess';
import { Type } from 'src/constant/Creation';
import { Status } from 'src/constant/Project';
import {
  PostUploadRequest,
  PostUploadResponse,
  PutUploadIdCoverRequest,
  UploadLyrics,
  UploadTrack,
} from 'src/model/api/Upload';
import { LyricsEntity } from 'src/model/entity/LyricsEntity';
import { Project } from 'src/model/entity/Project';
import { ProjectEntity } from 'src/model/entity/ProjectEntity';
import { ProjectUserEntity } from 'src/model/entity/ProjectUserEntity';
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

  @inject(ProjectUserAccess)
  private readonly projectUserAccess!: ProjectUserAccess;

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
        const creation = await this.viewCreationAccess.findOne({
          where: { name: data.inspiredId },
        });
        if (creation === null)
          throw new BadRequestError('track/lyrics not found');
        project = {
          id: creation.projectId,
          status: creation.projectStatus,
          createdAt: creation.projectCreatedAt,
          updatedAt: creation.projectUpdatedAt,
        };
      } else {
        const tmpProject = new ProjectEntity();
        tmpProject.status = Status.Created;

        const newProject = await this.projectAccess.save(tmpProject);
        project = newProject;
      }

      if (project === null) throw new BadRequestError('project not found');

      // save project-user pair
      const projectUser = new ProjectUserEntity();
      projectUser.projectId = project.id;
      projectUser.userId = this.cognitoUserId;
      await this.projectUserAccess.save(projectUser);

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
