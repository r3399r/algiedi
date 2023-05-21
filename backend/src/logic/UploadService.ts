import { S3 } from 'aws-sdk';
import { inject, injectable } from 'inversify';
import { DbAccess } from 'src/access/DbAccess';
import { LyricsAccess } from 'src/access/LyricsAccess';
import { ProjectAccess } from 'src/access/ProjectAccess';
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
import { TrackEntity } from 'src/model/entity/TrackEntity';
import { InternalServerError } from 'src/model/error';
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

  public async cleanup() {
    await this.dbAccess.cleanup();
  }

  private async s3Upload(data: string, fileId: string) {
    const buffer = Buffer.from(data, 'base64');
    // workaround for ES module
    const { fileTypeFromBuffer } = require('file-type'); // eslint-disable-line
    const res = await fileTypeFromBuffer(buffer);
    const bucket = `${process.env.PROJECT}-${process.env.ENVR}-storage`;
    const key = `${fileId}.${res?.ext}`;

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
    lyrics.lyrics = data.lyrics;
    lyrics.projectId = projectId;
    lyrics.inspiredId = data.inspiredId;

    await this.lyricsAccess.save(lyrics);
  }

  private async uploadTrack(data: UploadTrack, projectId: string) {
    const track = new TrackEntity();
    track.userId = this.cognitoUserId;
    track.projectId = projectId;
    track.inspiredId = data.inspiredId;

    const newTrack = await this.trackAccess.save(track);

    // upload file
    const fileKey = await this.s3Upload(data.file, `track/${newTrack.id}`);

    // upload tab file if exists
    let tabFileKey: string | null = null;
    if (data.tabFile)
      tabFileKey = await this.s3Upload(
        data.tabFile,
        `track-tab/${newTrack.id}`
      );

    newTrack.fileUri = fileKey;
    newTrack.tabFileUri = tabFileKey;
    await this.trackAccess.save(newTrack);
  }

  public async upload(data: PostUploadRequest): Promise<PostUploadResponse> {
    try {
      await this.dbAccess.startTransaction();

      // should check if inspired project completed or not
      // if yes -> create new project
      // if no -> join project
      let project: Project | null = null;
      // this project should be replaced with correct one

      // create new project if no inspired project
      if (data.inspiredId === null) {
        const tmpProject = new ProjectEntity();
        tmpProject.userId = this.cognitoUserId;
        tmpProject.status = Status.Created;
        tmpProject.name = data.name;
        tmpProject.description = data.description;
        tmpProject.theme = data.theme;
        tmpProject.genre = data.genre;
        tmpProject.language = data.language;
        tmpProject.caption = data.caption;

        const newProject = await this.projectAccess.save(tmpProject);
        project = newProject;

        // upload coverfile if exists
        if (data.coverFile) {
          const key = await this.s3Upload(
            data.coverFile,
            `project/${project.id}`
          );
          newProject.coverFileUri = key;
          await this.projectAccess.save(newProject);
        }
      }

      if (project === null)
        throw new InternalServerError('project should not be null');

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
