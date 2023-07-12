import { inject, injectable } from 'inversify';
import { DbAccess } from 'src/access/DbAccess';
import { InfoAccess } from 'src/access/InfoAccess';
import { LyricsAccess } from 'src/access/LyricsAccess';
import { LyricsHistoryAccess } from 'src/access/LyricsHistoryAccess';
import { ProjectAccess } from 'src/access/ProjectAccess';
import { ProjectHistoryAccess } from 'src/access/ProjectHistoryAccess';
import { ProjectUserAccess } from 'src/access/ProjectUserAccess';
import { TrackAccess } from 'src/access/TrackAccess';
import { TrackHistoryAccess } from 'src/access/TrackHistoryAccess';
import { UserAccess } from 'src/access/UserAccess';
import { ViewCreationAccess } from 'src/access/ViewCreationAccess';
import {
  PostUploadRequest,
  PutUploadIdRequest,
  UploadCommon,
  UploadLyrics,
  UploadTrack,
} from 'src/model/api/Upload';
import { Role, Status } from 'src/model/constant/Project';
import { InfoEntity } from 'src/model/entity/InfoEntity';
import { Lyrics, LyricsEntity } from 'src/model/entity/LyricsEntity';
import { LyricsHistoryEntity } from 'src/model/entity/LyricsHistoryEntity';
import { ProjectEntity } from 'src/model/entity/ProjectEntity';
import { ProjectHistoryEntity } from 'src/model/entity/ProjectHistoryEntity';
import { ProjectUserEntity } from 'src/model/entity/ProjectUserEntity';
import { Track, TrackEntity } from 'src/model/entity/TrackEntity';
import { TrackHistoryEntity } from 'src/model/entity/TrackHistoryEntity';
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

  @inject(LyricsHistoryAccess)
  private readonly lyricsHistoryAccess!: LyricsHistoryAccess;

  @inject(TrackAccess)
  private readonly trackAccess!: TrackAccess;

  @inject(TrackHistoryAccess)
  private readonly trackHistoryAccess!: TrackHistoryAccess;

  @inject(ProjectAccess)
  private readonly projectAccess!: ProjectAccess;

  @inject(ProjectUserAccess)
  private readonly projectUserAccess!: ProjectUserAccess;

  @inject(ProjectHistoryAccess)
  private readonly projectHistoryAccess!: ProjectHistoryAccess;

  @inject(UserAccess)
  private readonly userAccess!: UserAccess;

  @inject(InfoAccess)
  private readonly infoAccess!: InfoAccess;

  @inject(ViewCreationAccess)
  private readonly viewCreationAccess!: ViewCreationAccess;

  public async cleanup() {
    await this.dbAccess.cleanup();
  }

  private async uploadInfo(data: UploadCommon) {
    const info = new InfoEntity();
    info.name = data.name;
    info.description = data.description;
    info.theme = data.theme;
    info.genre = data.genre;
    info.language = data.language;
    info.caption = data.caption;

    let newInfo = await this.infoAccess.save(info);
    if (data.coverFile) {
      const key = await this.awsService.s3Upload(
        data.coverFile,
        `info/${info.id}`
      );
      newInfo.coverFileUri = key;
      newInfo = await this.infoAccess.save(newInfo);
    }

    return newInfo;
  }

  private async uploadLyrics(
    data: UploadLyrics,
    projectId: string | null,
    infoId: string
  ) {
    const lyrics = new LyricsEntity();
    lyrics.userId = this.cognitoUserId;
    lyrics.infoId = infoId;
    lyrics.projectId = projectId;
    lyrics.inspiredId = data.inspiredId;

    const newLyrics = await this.lyricsAccess.save(lyrics);

    // upload lyrics
    const lyricsHistory = new LyricsHistoryEntity();
    lyricsHistory.lyricsId = newLyrics.id;
    lyricsHistory.lyricsText = data.lyrics;
    await this.lyricsHistoryAccess.save(lyricsHistory);

    return newLyrics;
  }

  private async uploadTrack(
    data: UploadTrack,
    projectId: string | null,
    infoId: string
  ) {
    const track = new TrackEntity();
    track.userId = this.cognitoUserId;
    track.infoId = infoId;
    track.projectId = projectId;
    track.inspiredId = data.inspiredId;

    const newTrack = await this.trackAccess.save(track);

    // upload track
    const trackHistory = new TrackHistoryEntity();
    trackHistory.trackId = newTrack.id;
    const newTrackHistory = await this.trackHistoryAccess.save(trackHistory);

    // upload file
    const fileKey = await this.awsService.s3Upload(
      data.file,
      `track/${newTrack.id}/${new Date(
        newTrackHistory.createdAt
      ).toISOString()}/file`
    );

    // upload tab file if exists
    let tabFileKey: string | null = null;
    if (data.tabFile)
      tabFileKey = await this.awsService.s3Upload(
        data.tabFile,
        `track/${newTrack.id}/${new Date(
          newTrackHistory.createdAt
        ).toISOString()}/tab`
      );

    newTrackHistory.fileUri = fileKey;
    newTrackHistory.tabFileUri = tabFileKey;
    await this.trackHistoryAccess.save(newTrackHistory);

    return newTrack;
  }

  public async upload(data: PostUploadRequest) {
    try {
      await this.dbAccess.startTransaction();

      let projectId: string | null = null;
      let canJoinProject = false;

      // check if name is duplicated
      const userCreation = await this.viewCreationAccess.findOne({
        where: { name: data.name, userId: this.cognitoUserId },
      });
      if (userCreation !== null)
        throw new BadRequestError('this name is already used');

      // save info
      const info = await this.uploadInfo(data);

      // find existing project if inspired, or create new project if original
      if (data.inspiredId !== null) {
        const inspiredCreation = await this.viewCreationAccess.findOneById(
          data.inspiredId
        );
        if (inspiredCreation === null)
          throw new BadRequestError('track/lyrics not found');

        projectId = inspiredCreation.projectId;
        canJoinProject = inspiredCreation.projectStatus === Status.Created;
      } else {
        const tmpProject = new ProjectEntity();
        tmpProject.status = Status.Created;
        tmpProject.infoId = info.id;

        const newProject = await this.projectAccess.save(tmpProject);
        projectId = newProject.id;
        canJoinProject = true;
      }

      let creation: Lyrics | Track | null = null;
      if (data.type === 'lyrics')
        creation = await this.uploadLyrics(
          data,
          canJoinProject ? projectId : null,
          info.id
        );
      else if (data.type === 'track')
        creation = await this.uploadTrack(
          data,
          canJoinProject ? projectId : null,
          info.id
        );
      if (creation === null)
        throw new InternalServerError('creation should exist');

      // add project-user pair if can join project
      if (canJoinProject) {
        const pu = await this.projectUserAccess.findOne({
          where: { projectId, userId: this.cognitoUserId },
        });
        if (pu !== null && pu.lyricsId !== null && data.type === 'lyrics')
          throw new BadRequestError('Already participated with lyrics');
        if (pu !== null && pu.trackId !== null && data.type === 'track')
          throw new BadRequestError('Already participated with track');

        if (pu === null) {
          const projectUser = new ProjectUserEntity();
          projectUser.projectId = projectId;
          projectUser.userId = this.cognitoUserId;
          projectUser.lyricsId = data.type === 'lyrics' ? creation.id : null;
          projectUser.trackId = data.type === 'track' ? creation.id : null;
          projectUser.role =
            data.inspiredId !== null ? Role.Inspiration : Role.Owner;
          projectUser.isAccepted = data.inspiredId !== null ? false : null;

          await this.projectUserAccess.save(projectUser);
        } else {
          pu.lyricsId = data.type === 'lyrics' ? creation.id : pu.lyricsId;
          pu.trackId = data.type === 'track' ? creation.id : pu.trackId;
          await this.projectUserAccess.save(pu);
        }

        const user = await this.userAccess.findOneByIdOrFail(
          this.cognitoUserId
        );
        user.lastProjectId = projectId;
        await this.userAccess.save(user);
      }

      await this.dbAccess.commitTransaction();
    } catch (e) {
      await this.dbAccess.rollbackTransaction();
      throw e;
    }
  }

  public async updateUpload(creationId: string, data: PutUploadIdRequest) {
    try {
      await this.dbAccess.startTransaction();
      if (data.type === 'lyrics') {
        const lyrics = await this.lyricsAccess.findOneById(creationId);
        if (lyrics === null) throw new BadRequestError('lyrics not found');
        if (lyrics.userId !== this.cognitoUserId)
          throw new UnauthorizedError('unauthorized');

        // upload lyrics
        const lyricsHistory = new LyricsHistoryEntity();
        lyricsHistory.lyricsId = lyrics.id;
        lyricsHistory.lyricsText = data.lyrics;
        await this.lyricsHistoryAccess.save(lyricsHistory);
      } else if (data.type === 'track') {
        const track = await this.trackAccess.findOneById(creationId);
        if (track === null) throw new BadRequestError('lyrics not found');
        if (track.userId !== this.cognitoUserId)
          throw new UnauthorizedError('unauthorized');

        const trackHistory = new TrackHistoryEntity();
        trackHistory.trackId = track.id;
        const newTrackHistory = await this.trackHistoryAccess.save(
          trackHistory
        );

        // upload file
        const fileKey = await this.awsService.s3Upload(
          data.file,
          `track/${track.id}/${new Date(
            newTrackHistory.createdAt
          ).toISOString()}/file`
        );

        // upload tab file if exists
        let tabFileKey: string | null = null;
        if (data.tabFile)
          tabFileKey = await this.awsService.s3Upload(
            data.tabFile,
            `track/${track.id}/${new Date(
              newTrackHistory.createdAt
            ).toISOString()}/tab`
          );

        newTrackHistory.fileUri = fileKey;
        newTrackHistory.tabFileUri = tabFileKey;
        await this.trackHistoryAccess.save(newTrackHistory);
      } else if (data.type === 'song') {
        // valiate owner
        await this.projectUserAccess.findOneOrFail({
          where: {
            userId: this.cognitoUserId,
            projectId: creationId,
            role: Role.Owner,
          },
        });
        const project = await this.projectAccess.findOneByIdOrFail(creationId);

        const projectHistory = new ProjectHistoryEntity();
        projectHistory.projectId = project.id;
        projectHistory.lyricsText = data.lyrics ?? null;
        const newProjectHistory = await this.projectHistoryAccess.save(
          projectHistory
        );

        // upload file
        let fileKey: string | null = null;
        if (data.file)
          fileKey = await this.awsService.s3Upload(
            data.file,
            `song/${project.id}/${new Date(
              newProjectHistory.createdAt
            ).toISOString()}/file`
          );

        // upload tab file if exists
        let tabFileKey: string | null = null;
        if (data.tabFile)
          tabFileKey = await this.awsService.s3Upload(
            data.tabFile,
            `song/${project.id}/${new Date(
              newProjectHistory.createdAt
            ).toISOString()}/tab`
          );

        newProjectHistory.trackFileUri = fileKey;
        newProjectHistory.tabFileUri = tabFileKey;

        await this.projectHistoryAccess.save(newProjectHistory);
      } else throw new BadRequestError('type not found');

      await this.dbAccess.commitTransaction();
    } catch (e) {
      await this.dbAccess.rollbackTransaction();
      throw e;
    }
  }
}
