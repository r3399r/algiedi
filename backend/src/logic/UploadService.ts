import { S3 } from 'aws-sdk';
// import { fileTypeFromBuffer } from 'file-type';
import { inject, injectable } from 'inversify';
import { v4 as uuidv4 } from 'uuid';
import { DbAccess } from 'src/access/DbAccess';
import { LyricsAccess } from 'src/access/LyricsAccess';
import { ProjectAccess } from 'src/access/ProjectAccess';
import { TrackAccess } from 'src/access/TrackAccess';
import {
  PostUploadRequest,
  UploadLyrics,
  UploadTrack,
} from 'src/model/api/Upload';
import { LyricsEntity } from 'src/model/entity/LyricsEntity';
import { ProjectEntity } from 'src/model/entity/ProjectEntity';
import { TrackEntity } from 'src/model/entity/TrackEntity';

/**
 * Service class for Uplaod
 */
@injectable()
export class UploadService {
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
    lyrics.lyrics = data.lyrics;
    lyrics.projectId = projectId;
    lyrics.inspiredProjectId = data.inspiredProjectId;

    await this.lyricsAccess.save(lyrics);
  }

  private async uploadTrack(data: UploadTrack, projectId: string) {
    const track = new TrackEntity();
    track.projectId = projectId;
    track.inspiredProjectId = data.inspiredProjectId;

    const newTrack = await this.trackAccess.save(track);

    // upload file
    const fileKey = await this.s3Upload(data.file, newTrack.id);

    // upload tab file if exists
    let tabFileKey: string | null = null;
    if (data.tabFile) tabFileKey = await this.s3Upload(data.tabFile, uuidv4());

    newTrack.fileUri = fileKey;
    newTrack.tabFileUri = tabFileKey;
    await this.trackAccess.save(newTrack);
  }

  public async upload(data: PostUploadRequest) {
    try {
      await this.dbAccess.startTransaction();

      // should check if inspired project completed or not
      // if yes -> create new project
      // if no -> join project
      let projectId = 'xx';
      // this projectId should be replaced with correct id

      // create new project if no inspired project
      if (data.inspiredProjectId === null) {
        const project = new ProjectEntity();
        project.name = data.name;
        project.description = data.description;
        project.theme = data.theme;
        project.genre = data.genre;
        project.language = data.language;
        project.caption = data.caption;

        const newProject = await this.projectAccess.save(project);
        projectId = newProject.id;

        // upload coverfile if exists
        if (data.coverFile) {
          const key = await this.s3Upload(data.coverFile, project.id);
          newProject.coverFileUri = key;
          await this.projectAccess.save(newProject);
        }
      }

      if (data.type === 'lyrics') await this.uploadLyrics(data, projectId);
      else if (data.type === 'track') await this.uploadTrack(data, projectId);

      await this.dbAccess.commitTransaction();
    } catch (e) {
      await this.dbAccess.rollbackTransaction();
      throw e;
    }
  }
}
