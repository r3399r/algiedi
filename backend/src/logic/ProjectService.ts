import { inject, injectable } from 'inversify';
import { In, Not } from 'typeorm';
import { ChatAccess } from 'src/access/ChatAccess';
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
  GetProjectIdChatResponse,
  GetProjectResponse,
  PostProjectIdOriginalRequest,
  PutProjectIdCoverRequest,
  PutProjectRequest,
} from 'src/model/api/Project';
import { Type } from 'src/model/constant/Creation';
import { NotificationType } from 'src/model/constant/Notification';
import { Role, Status } from 'src/model/constant/Project';
import { InfoEntity } from 'src/model/entity/InfoEntity';
import { LyricsEntity } from 'src/model/entity/LyricsEntity';
import { LyricsHistoryEntity } from 'src/model/entity/LyricsHistoryEntity';
import { NotificationEntity } from 'src/model/entity/NotificationEntity';
import { TrackEntity } from 'src/model/entity/TrackEntity';
import { TrackHistoryEntity } from 'src/model/entity/TrackHistoryEntity';
import {
  BadRequestError,
  InternalServerError,
  UnauthorizedError,
} from 'src/model/error';
import { DetailedCreation } from 'src/model/Project';
import { compare } from 'src/util/compare';
import { cognitoSymbol } from 'src/util/LambdaSetup';
import { AwsService } from './AwsService';
import { NotificationService } from './NotificationService';

/**
 * Service class for Project
 */
@injectable()
export class ProjectService {
  @inject(cognitoSymbol)
  private readonly cognitoUserId!: string;

  @inject(AwsService)
  private readonly awsService!: AwsService;

  @inject(NotificationService)
  private readonly notificationService!: NotificationService;

  @inject(DbAccess)
  private readonly dbAccess!: DbAccess;

  @inject(ProjectAccess)
  private readonly projectAccess!: ProjectAccess;

  @inject(ProjectHistoryAccess)
  private readonly projectHistoryAccess!: ProjectHistoryAccess;

  @inject(ProjectUserAccess)
  private readonly projectUserAccess!: ProjectUserAccess;

  @inject(LyricsAccess)
  private readonly lyricsAccess!: LyricsAccess;

  @inject(LyricsHistoryAccess)
  private readonly lyricsHistoryAccess!: LyricsHistoryAccess;

  @inject(TrackAccess)
  private readonly trackAccess!: TrackAccess;

  @inject(TrackHistoryAccess)
  private readonly trackHistoryAccess!: TrackHistoryAccess;

  @inject(UserAccess)
  private readonly userAccess!: UserAccess;

  @inject(InfoAccess)
  private readonly infoAccess!: InfoAccess;

  @inject(ViewCreationAccess)
  private readonly viewCreationAccess!: ViewCreationAccess;

  @inject(ChatAccess)
  private readonly chatAccess!: ChatAccess;

  public async cleanup() {
    await this.dbAccess.cleanup();
  }

  public async getMyProjects(): Promise<GetProjectResponse> {
    const myProjectUser = await this.projectUserAccess.find({
      where: {
        userId: this.cognitoUserId,
        project: { status: Not(Status.Published) },
        role: Not(Role.Rejected),
      },
    });
    const myProjectIds = myProjectUser.map((v) => v.projectId);
    const allCreations = await this.viewCreationAccess.find({
      where: {
        projectId: In(myProjectIds),
      },
    });
    const detailedAllCreations: DetailedCreation[] = allCreations.map((c) => ({
      ...c,
      fileUrl: this.awsService.getS3SignedUrl(c.fileUri),
      tabFileUrl: this.awsService.getS3SignedUrl(c.tabFileUri),
      info: {
        ...c.info,
        coverFileUrl: this.awsService.getS3SignedUrl(c.info.coverFileUri),
      },
    }));
    const relatedProjectUsers = await this.projectUserAccess.find({
      where: {
        projectId: In(myProjectIds),
        role: Not(Role.Rejected),
      },
    });

    return myProjectUser.map((pu) => {
      if (pu.project.infoId === null)
        throw new InternalServerError('info not found');
      const detail = detailedAllCreations.find(
        (o) => o.type === Type.Song && o.projectId === pu.projectId
      );
      if (detail === undefined)
        throw new InternalServerError('project not found');

      return {
        ...detail,
        collaborators: relatedProjectUsers
          .filter((o) => o.projectId === pu.projectId)
          .map((o) => ({
            id: o.id,
            user: {
              ...o.user,
              avatarUrl: this.awsService.getS3SignedUrl(o.user.avatar),
            },
            role: o.role,
            isAccepted: o.isAccepted,
            isReady: o.isReady,
            track: detailedAllCreations.find((c) => c.id === o.trackId) ?? null,
            lyrics:
              detailedAllCreations.find((c) => c.id === o.lyricsId) ?? null,
          })),
      };
    });
  }

  public async updateProject(
    id: string,
    data: PutProjectRequest
  ): Promise<void> {
    try {
      await this.dbAccess.startTransaction();

      const pu = await this.projectUserAccess.findByProjectId(id);

      // valiate owner
      const puOwner = pu.find((v) => v.role === Role.Owner);
      if (puOwner === undefined || puOwner?.userId !== this.cognitoUserId)
        throw new UnauthorizedError('Unauthorized');

      // check if name is duplicated
      const userCreation = await this.viewCreationAccess.findOne({
        where: { info: { name: data.name }, userId: this.cognitoUserId },
      });
      if (userCreation !== null && userCreation.projectId !== id)
        throw new BadRequestError('this name is already used');

      const info = puOwner.project.info;
      info.name = data.name ?? info.name;
      info.description = data.description ?? info.description;
      info.theme = data.theme ?? info.theme;
      info.genre = data.genre ?? info.genre;
      info.language = data.language ?? info.language;
      info.caption = data.caption ?? info.caption;
      await this.infoAccess.save(info);

      // notify
      for (const v of pu) {
        if (v.userId === this.cognitoUserId) continue;
        if (v.project.status === Status.Published) continue;
        if (v.project.status === Status.InProgress && v.role === Role.Rejected)
          continue;
        await this.notificationService.notify(
          NotificationType.ProjectUpdated,
          v.user,
          v.project.id
        );
      }

      await this.dbAccess.commitTransaction();
    } catch (e) {
      await this.dbAccess.rollbackTransaction();
      throw e;
    }
  }

  public async projectApproval(projectId: string, userId: string) {
    try {
      await this.dbAccess.startTransaction();
      // valiate owner
      await this.projectUserAccess.findOneOrFail({
        where: {
          userId: this.cognitoUserId,
          projectId,
          role: Role.Owner,
        },
      });

      const projectUser = await this.projectUserAccess.findOneOrFail({
        where: {
          userId,
          projectId,
        },
      });
      projectUser.isAccepted = !projectUser.isAccepted;
      await this.projectUserAccess.save(projectUser);

      // notify
      const user = await this.userAccess.findOneByIdOrFail(userId);
      await this.notificationService.notify(
        projectUser.isAccepted
          ? NotificationType.InspiredApproved
          : NotificationType.InspiredUnapproved,
        user,
        projectId
      );

      await this.dbAccess.commitTransaction();
    } catch (e) {
      await this.dbAccess.rollbackTransaction();
    }
  }

  public async projectReady(projectId: string) {
    try {
      await this.dbAccess.startTransaction();
      const projectUser = await this.projectUserAccess.findByProjectId(
        projectId
      );
      const mePu = projectUser.find((v) => v.userId === this.cognitoUserId);
      if (!mePu) throw new Error('unexpected error');
      mePu.isReady = !mePu.isReady;
      await this.projectUserAccess.save(mePu);

      // notify
      const project = await this.projectAccess.findOneOrFailById(projectId);
      for (const pu of projectUser) {
        if (pu.userId === this.cognitoUserId) continue;
        if (project.status === Status.Published) continue;
        if (project.status === Status.InProgress && pu.role === Role.Rejected)
          continue;
        const user = await this.userAccess.findOneByIdOrFail(pu.userId);
        await this.notificationService.notify(
          mePu.isReady
            ? NotificationType.PartnerReady
            : NotificationType.PartnerNotReady,
          user,
          project.id
        );
      }

      await this.dbAccess.commitTransaction();
    } catch (e) {
      await this.dbAccess.rollbackTransaction();
    }
  }

  public async setLastProject(id: string) {
    const user = await this.userAccess.findOneByIdOrFail(this.cognitoUserId);

    user.lastProjectId = id;
    await this.userAccess.save(user);
  }

  public async addOriginal(
    projectId: string,
    data: PostProjectIdOriginalRequest
  ) {
    const projectUser = await this.projectUserAccess.findByProjectId(projectId);
    const ownerProjectUser = projectUser.find(
      (v) => v.userId === this.cognitoUserId
    );

    if (ownerProjectUser === undefined)
      throw new BadRequestError('data not found');
    if (ownerProjectUser.lyricsId !== null && ownerProjectUser.trackId !== null)
      throw new InternalServerError('original already exists');
    if (data.type === 'track' && ownerProjectUser.lyricsId === null)
      throw new BadRequestError('there is no lyrics');
    if (data.type === 'lyrics' && ownerProjectUser.trackId === null)
      throw new BadRequestError('there is no track');

    const project = await this.projectAccess.findOneOrFailById(projectId);

    if (data.type === 'track' && ownerProjectUser.lyricsId) {
      const lyrics = await this.lyricsAccess.findOneOrFailById(
        ownerProjectUser.lyricsId
      );
      const track = new TrackEntity();
      track.userId = this.cognitoUserId;
      track.infoId = project.infoId;
      track.projectId = lyrics.projectId;

      const newTrack = await this.trackAccess.save(track);
      const trackHistory = new TrackHistoryEntity();
      trackHistory.trackId = newTrack.id;
      const newTrackHistory = await this.trackHistoryAccess.save(trackHistory);

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

      ownerProjectUser.trackId = newTrack.id;
      await this.projectUserAccess.save(ownerProjectUser);
    } else if (data.type === 'lyrics' && ownerProjectUser.trackId) {
      const track = await this.trackAccess.findOneOrFailById(
        ownerProjectUser.trackId
      );
      const lyrics = new LyricsEntity();
      lyrics.userId = this.cognitoUserId;
      lyrics.infoId = project.infoId;
      lyrics.projectId = track.projectId;

      const newLyrics = await this.lyricsAccess.save(lyrics);
      const lyricsHistory = new LyricsHistoryEntity();
      lyricsHistory.lyricsId = newLyrics.id;
      lyricsHistory.lyricsText = data.lyrics;
      await this.lyricsHistoryAccess.save(lyricsHistory);

      ownerProjectUser.lyricsId = newLyrics.id;
      await this.projectUserAccess.save(ownerProjectUser);
    }

    // notify
    for (const pu of projectUser) {
      if (pu.userId === this.cognitoUserId) continue;
      if (project.status === Status.Published) continue;
      if (project.status === Status.InProgress && pu.role === Role.Rejected)
        continue;
      const user = await this.userAccess.findOneByIdOrFail(pu.userId);
      await this.notificationService.notify(
        NotificationType.CreationUploaded,
        user,
        project.id
      );
    }
  }

  public async startProject(id: string) {
    try {
      await this.dbAccess.startTransaction();

      const myProjectUser = await this.projectUserAccess.findOneOrFail({
        where: { userId: this.cognitoUserId, projectId: id, role: Role.Owner },
      });
      if (myProjectUser.lyricsId === null && myProjectUser.trackId === null)
        throw new InternalServerError('no lyrics or track');

      const creation = await this.viewCreationAccess.findOneById(
        (myProjectUser.lyricsId || myProjectUser.trackId) ?? 'xx'
      );
      if (creation === null)
        throw new InternalServerError('creation not found');

      const project = await this.projectAccess.findOneOrFailById(id);
      if (project.infoId === null)
        throw new InternalServerError('info not found');
      const info = project.info;
      const newInfo = new InfoEntity();
      newInfo.name = info.name;
      newInfo.description = info.description;
      newInfo.theme = info.theme;
      newInfo.genre = info.genre;
      newInfo.language = info.language;
      newInfo.caption = info.caption;
      newInfo.coverFileUri = info.coverFileUri;
      const newInfoObj = await this.infoAccess.save(newInfo);

      project.status = Status.InProgress;
      project.infoId = newInfoObj.id;
      project.startedAt = new Date().toISOString();
      await this.projectAccess.save(project);

      const projectUsers = await this.projectUserAccess.findByProjectId(id);
      const users = projectUsers.map((v) => v.user);
      const notification = new NotificationEntity();
      notification.isRead = false;

      for (const pu of projectUsers) {
        const user = users.find((v) => v.id === pu.userId);
        if (pu.role === Role.Owner) continue;
        if (pu.isAccepted === true) {
          pu.role = Role.Collaborator;
          pu.isReady = false;
          if (user)
            await this.notificationService.notify(
              NotificationType.ProjectStart,
              user,
              pu.projectId
            );
        } else {
          pu.role = Role.Rejected;
          if (user)
            await this.notificationService.notify(
              NotificationType.ProjectReject,
              user,
              pu.projectId
            );
        }

        await this.projectUserAccess.save(pu);
      }

      await this.dbAccess.commitTransaction();
    } catch (e) {
      await this.dbAccess.rollbackTransaction();
      throw e;
    }
  }

  public async publishProject(id: string) {
    try {
      await this.dbAccess.startTransaction();

      // validate owner
      await this.projectUserAccess.findOneOrFail({
        where: { userId: this.cognitoUserId, projectId: id, role: Role.Owner },
      });

      const projectHistory = await this.projectHistoryAccess.find({
        where: { projectId: id },
      });
      if (projectHistory.length === 0) throw new BadRequestError('no content');

      const project = await this.projectAccess.findOneOrFailById(id);
      if (project.status !== Status.InProgress)
        throw new BadRequestError('project is not in progress');

      project.status = Status.Published;
      project.publishedAt = new Date().toISOString();
      await this.projectAccess.save(project);

      // notify
      const projectUser = await this.projectUserAccess.findByProjectId(id);
      for (const pu of projectUser) {
        const user = await this.userAccess.findOneByIdOrFail(pu.userId);
        if (pu.role === Role.Owner) continue;
        await this.notificationService.notify(
          NotificationType.ProjectPublish,
          user,
          pu.projectId
        );
      }

      await this.dbAccess.commitTransaction();
    } catch (e) {
      await this.dbAccess.rollbackTransaction();
      throw e;
    }
  }

  public async updateProjectCover(id: string, data: PutProjectIdCoverRequest) {
    try {
      await this.dbAccess.startTransaction();

      const project = await this.projectAccess.findOneOrFailById(id);
      if (project.infoId === null)
        throw new InternalServerError('no info found');

      const key = await this.awsService.s3Upload(
        data.file,
        `info/${project.infoId}`
      );
      const info = await this.infoAccess.findOneOrFailById(project.infoId);
      info.coverFileUri = key;
      await this.infoAccess.save(info);

      // notify
      const projectUser = await this.projectUserAccess.findByProjectId(id);
      for (const pu of projectUser) {
        if (pu.userId === this.cognitoUserId) continue;
        if (project.status === Status.Published) continue;
        if (project.status === Status.InProgress && pu.role === Role.Rejected)
          continue;
        const user = await this.userAccess.findOneByIdOrFail(pu.userId);
        await this.notificationService.notify(
          NotificationType.ProjectUpdated,
          user,
          project.id
        );
      }

      await this.dbAccess.commitTransaction();
    } catch (e) {
      await this.dbAccess.rollbackTransaction();
      throw e;
    }
  }

  public async getProjectChat(id: string): Promise<GetProjectIdChatResponse> {
    const chats = await this.chatAccess.find({ where: { projectId: id } });

    return chats
      .map((v) => ({
        user: v.user,
        content: v.content,
        createdAt: v.createdAt ?? '',
      }))
      .sort(compare('createdAt', 'desc'));
  }
}
