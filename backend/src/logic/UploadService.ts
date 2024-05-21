import { inject, injectable } from 'inversify';
import { CaptionAccess } from 'src/access/CaptionAccess';
import { FollowAccess } from 'src/access/FollowAccess';
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
import { NotificationType } from 'src/model/constant/Notification';
import { Role, Status } from 'src/model/constant/Project';
import { CaptionEntity } from 'src/model/entity/CaptionEntity';
import { InfoEntity } from 'src/model/entity/InfoEntity';
import { Lyrics, LyricsEntity } from 'src/model/entity/LyricsEntity';
import { LyricsHistoryEntity } from 'src/model/entity/LyricsHistoryEntity';
import { ProjectEntity } from 'src/model/entity/ProjectEntity';
import {
  ProjectHistory,
  ProjectHistoryEntity,
} from 'src/model/entity/ProjectHistoryEntity';
import { ProjectUserEntity } from 'src/model/entity/ProjectUserEntity';
import { Track, TrackEntity } from 'src/model/entity/TrackEntity';
import {
  TrackHistory,
  TrackHistoryEntity,
} from 'src/model/entity/TrackHistoryEntity';
import {
  BadRequestError,
  InternalServerError,
  UnauthorizedError,
} from 'src/model/error';
import { cognitoSymbol } from 'src/util/LambdaSetup';
import { AwsService } from './AwsService';
import { NotificationService } from './NotificationService';

/**
 * Service class for Uplaod
 */
@injectable()
export class UploadService {
  @inject(cognitoSymbol)
  private readonly cognitoUserId!: string;

  @inject(AwsService)
  private readonly awsService!: AwsService;

  @inject(NotificationService)
  private readonly notificationService!: NotificationService;

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

  @inject(CaptionAccess)
  private readonly captionAccess!: CaptionAccess;

  @inject(InfoAccess)
  private readonly infoAccess!: InfoAccess;

  @inject(FollowAccess)
  private readonly followAccess!: FollowAccess;

  @inject(ViewCreationAccess)
  private readonly viewCreationAccess!: ViewCreationAccess;

  private async uploadInfo(data: UploadCommon) {
    const info = new InfoEntity();
    info.name = data.name;
    info.description = data.description;
    info.theme = data.theme;
    info.genre = data.genre;
    info.language = data.language;
    let newInfo = await this.infoAccess.save(info);

    if (data.coverFile) {
      const key = await this.awsService.s3Upload(
        data.coverFile,
        `info/${newInfo.id}`
      );
      newInfo.coverFileUri = key;
      newInfo = await this.infoAccess.save(newInfo);
    }

    if (data.caption)
      for (const c of data.caption) {
        const oldCaption = await this.captionAccess.findOne({
          where: { name: c, infoId: newInfo.id },
        });
        if (oldCaption === null) {
          const caption = new CaptionEntity();
          caption.name = c;
          caption.infoId = newInfo.id;
          await this.captionAccess.save(caption);
        }
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
    let projectId: string | null = null;
    let canJoinProject = false;

    // check if name is duplicated
    const userCreation = await this.viewCreationAccess.findOne({
      where: { info: { name: data.name }, userId: this.cognitoUserId },
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
      canJoinProject = inspiredCreation.project?.status === Status.Created;
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

    // add project-user pair if can join project and notify
    if (canJoinProject && projectId) {
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

      const user = await this.userAccess.findOneByIdOrFail(this.cognitoUserId);
      user.lastProjectId = projectId;
      await this.userAccess.save(user);

      // notify project owner if inspired
      const ownerPu = await this.projectUserAccess.findOneOrFail({
        where: { projectId, role: Role.Owner },
      });
      const owner = await this.userAccess.findOneByIdOrFail(ownerPu.userId);
      if (ownerPu.userId !== this.cognitoUserId)
        await this.notificationService.notify(
          NotificationType.NewParticipant,
          owner,
          projectId
        );
    }

    // notify follower
    if (projectId) {
      const followers = await this.followAccess.find({
        where: {
          followeeId: this.cognitoUserId,
        },
      });
      for (const f of followers)
        await this.notificationService.notify(
          NotificationType.FolloweeUploaded,
          f.follower,
          projectId
        );
    }
  }

  public async updateUpload(creationId: string, data: PutUploadIdRequest) {
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

      // prepare history if needed
      let latestHistory: TrackHistory | null = null;
      if (!data.file || !data.tabFile)
        latestHistory = await this.trackHistoryAccess.findOneOrFail({
          where: { trackId: track.id },
          order: { createdAt: 'desc' },
        });

      const trackHistory = new TrackHistoryEntity();
      trackHistory.trackId = track.id;
      const newTrackHistory = await this.trackHistoryAccess.save(trackHistory);

      // upload file if exists else get the latest uri
      let fileKey: string;
      if (data.file)
        fileKey = await this.awsService.s3Upload(
          data.file,
          `track/${track.id}/${new Date(
            newTrackHistory.createdAt
          ).toISOString()}/file`
        );
      else {
        if (latestHistory === null)
          throw new InternalServerError('latest history should exist');
        fileKey = latestHistory.fileUri;
      }

      // upload tab file if exists
      let tabFileKey: string | null = null;
      if (data.tabFile)
        tabFileKey = await this.awsService.s3Upload(
          data.tabFile,
          `track/${track.id}/${new Date(
            newTrackHistory.createdAt
          ).toISOString()}/tab`
        );
      else
        tabFileKey =
          data.tabFile === null ? null : latestHistory?.tabFileUri ?? null;

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
      const project = await this.projectAccess.findOneOrFailById(creationId);

      // prepare history if needed
      let latestHistory: ProjectHistory | null = null;
      if (!data.file || !data.tabFile)
        latestHistory = await this.projectHistoryAccess.findOne({
          where: { projectId: project.id },
          order: { createdAt: 'desc' },
        });

      const projectHistory = new ProjectHistoryEntity();
      projectHistory.projectId = project.id;
      projectHistory.lyricsText = data.lyrics ?? null;
      const newProjectHistory = await this.projectHistoryAccess.save(
        projectHistory
      );

      // upload file if exists else get the latest uri
      let fileKey: string | null;
      if (data.file)
        fileKey = await this.awsService.s3Upload(
          data.file,
          `song/${project.id}/${new Date(
            newProjectHistory.createdAt
          ).toISOString()}/file`
        );
      else {
        if (latestHistory === null)
          throw new InternalServerError('latest history should exist');
        fileKey = latestHistory.trackFileUri;
      }

      // upload tab file if exists
      let tabFileKey: string | null = null;
      if (data.tabFile)
        tabFileKey = await this.awsService.s3Upload(
          data.tabFile,
          `song/${project.id}/${new Date(
            newProjectHistory.createdAt
          ).toISOString()}/tab`
        );
      else
        tabFileKey =
          data.tabFile === null ? null : latestHistory?.tabFileUri ?? null;

      newProjectHistory.trackFileUri = fileKey;
      newProjectHistory.tabFileUri = tabFileKey;

      await this.projectHistoryAccess.save(newProjectHistory);
    } else throw new BadRequestError('type not found');

    // notify
    const creation = await this.viewCreationAccess.findOneByIdOrFail(
      creationId
    );
    if (creation.projectId && creation.project?.status !== Status.Published) {
      const projectUser = await this.projectUserAccess.findByProjectId(
        creation.projectId
      );

      for (const pu of projectUser) {
        if (pu.userId === this.cognitoUserId) continue;
        if (
          creation.project?.status === Status.InProgress &&
          pu.role === Role.Rejected
        )
          continue;
        await this.notificationService.notify(
          NotificationType.CreationUpdated,
          pu.user,
          creation.projectId
        );
      }
    }
  }
}
