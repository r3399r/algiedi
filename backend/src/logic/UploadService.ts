import { S3 } from 'aws-sdk';
import { inject, injectable } from 'inversify';
import { DbAccess } from 'src/access/DbAccess';
import { LyricsAccess } from 'src/access/LyricsAccess';
import { ProjectAccess } from 'src/access/ProjectAccess';
import { ProjectUserAccess } from 'src/access/ProjectUserAccess';
import { TrackAccess } from 'src/access/TrackAccess';
import { Status } from 'src/constant/Project';
import {
  PostUploadRequest,
  PostUploadResponse,
  UploadLyrics,
  UploadTrack,
} from 'src/model/api/Upload';
import { LyricsEntity } from 'src/model/entity/LyricsEntity';
import { Project } from 'src/model/entity/Project';
import { ProjectEntity } from 'src/model/entity/ProjectEntity';
import { ProjectUserEntity } from 'src/model/entity/ProjectUserEntity';
import { TrackEntity } from 'src/model/entity/TrackEntity';
import { BadRequestError } from 'src/model/error';
import { cognitoSymbol } from 'src/util/LambdaSetup';

/**
 * Service class for Uplaod
 */
@injectable()
export class UploadService {
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

  @inject(ProjectUserAccess)
  private readonly projectUserAccess!: ProjectUserAccess;

  public async cleanup() {
    await this.dbAccess.cleanup();
  }

  private async s3Upload(data: string, filename: string) {
    const buffer = Buffer.from(data, 'base64');
    // workaround for ES module
    const { fileTypeFromBuffer } = require('file-type'); // eslint-disable-line
    const res = await fileTypeFromBuffer(buffer);
    const bucket = `${process.env.PROJECT}-${process.env.ENVR}-storage`;
    const key = `${filename}.${res?.ext}`;

    await this.s3
      .putObject({
        Body: buffer,
        Bucket: bucket,
        Key: key,
      })
      .promise();

    return key;
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
      const key = await this.s3Upload(
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
    const fileKey = await this.s3Upload(data.file, `track/${newTrack.id}/file`);

    // upload tab file if exists
    let tabFileKey: string | null = null;
    if (data.tabFile)
      tabFileKey = await this.s3Upload(
        data.tabFile,
        `track/${newTrack.id}/tab`
      );

    // upload coverfile if exists
    let coverFileKey: string | null = null;
    if (data.coverFile)
      coverFileKey = await this.s3Upload(
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
        // const lyrics = await this.lyricsAccess.findOneById(data.inspiredId);
        // const track = await this.trackAccess.findOneById(data.inspiredId);
        const lyrics = await this.lyricsAccess.findOne({
          where: { name: data.inspiredId },
        });
        const track = await this.trackAccess.findOne({
          where: { name: data.inspiredId },
        });
        if (track === null && lyrics !== null)
          project = await this.projectAccess.findOneById(lyrics.projectId);
        else if (track !== null && lyrics === null)
          project = await this.projectAccess.findOneById(track.projectId);
        else throw new BadRequestError('track/lyrics not found');
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
}
