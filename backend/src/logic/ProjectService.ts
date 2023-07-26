import { inject, injectable } from 'inversify';
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
import { Role, Status } from 'src/model/constant/Project';
import { InfoEntity } from 'src/model/entity/InfoEntity';
import { LyricsEntity } from 'src/model/entity/LyricsEntity';
import { LyricsHistoryEntity } from 'src/model/entity/LyricsHistoryEntity';
import { TrackEntity } from 'src/model/entity/TrackEntity';
import { TrackHistoryEntity } from 'src/model/entity/TrackHistoryEntity';
import { BadRequestError, InternalServerError } from 'src/model/error';
import { DetailedCreation } from 'src/model/Project';
import { compare } from 'src/util/compare';
import { cognitoSymbol } from 'src/util/LambdaSetup';
import { AwsService } from './AwsService';

/**
 * Service class for Project
 */
@injectable()
export class ProjectService {
  @inject(cognitoSymbol)
  private readonly cognitoUserId!: string;

  @inject(AwsService)
  private readonly awsService!: AwsService;

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
    const myProjectUser = await this.projectUserAccess.findByUserId(
      this.cognitoUserId
    );
    const myProjectIds = new Set(
      myProjectUser
        .filter((v) => v.role !== Role.Rejected)
        .map((v) => v.projectId)
    );
    const myProjects = (
      await Promise.all(
        [...myProjectIds].map(
          async (v) => await this.projectAccess.findOneByIdOrFail(v)
        )
      )
    ).filter((v) => v.status !== Status.Published);

    return await Promise.all(
      myProjects.map(async (project) => {
        if (project.infoId === null)
          throw new InternalServerError('info not found');
        const projectUser = await this.projectUserAccess.findByProjectId(
          project.id
        );
        const creations = await this.viewCreationAccess.findByProjectId(
          project.id
        );

        const detailedCreations: DetailedCreation[] = creations.map((c) => ({
          ...c,
          fileUrl: this.awsService.getS3SignedUrl(c.fileUri),
          tabFileUrl: this.awsService.getS3SignedUrl(c.tabFileUri),
          coverFileUrl: this.awsService.getS3SignedUrl(c.coverFileUri),
        }));

        const info = await this.infoAccess.findOneOrFailById(project.infoId);

        return {
          ...project,
          name: info.name,
          description: info.description,
          theme: info.theme,
          genre: info.genre,
          language: info.language,
          caption: info.caption,
          coverFileUri: info.coverFileUri,
          coverFileUrl: this.awsService.getS3SignedUrl(info.coverFileUri),
          song: detailedCreations.find((o) => o.type === 'song') ?? null,
          collaborators: await Promise.all(
            projectUser
              .filter((v) => v.role !== Role.Rejected)
              .map(async (v) => {
                const user = await this.userAccess.findOneByIdOrFail(v.userId);

                return {
                  id: v.id,
                  user,
                  role: v.role,
                  isAccepted: v.isAccepted,
                  isReady: v.isReady,
                  track:
                    detailedCreations.find((o) => o.id === v.trackId) ?? null,
                  lyrics:
                    detailedCreations.find((o) => o.id === v.lyricsId) ?? null,
                };
              })
          ),
        };
      })
    );
  }

  public async updateProject(
    id: string,
    data: PutProjectRequest
  ): Promise<void> {
    try {
      await this.dbAccess.startTransaction();

      // valiate owner
      await this.projectUserAccess.findOneOrFail({
        where: {
          userId: this.cognitoUserId,
          projectId: id,
          role: Role.Owner,
        },
      });

      // check if name is duplicated
      const userCreation = await this.viewCreationAccess.findOne({
        where: { name: data.name, userId: this.cognitoUserId },
      });
      if (userCreation !== null && userCreation.projectId !== id)
        throw new BadRequestError('this name is already used');

      const project = await this.projectAccess.findOneByIdOrFail(id);
      if (project.infoId === null)
        throw new InternalServerError('info not found');

      const info = await this.infoAccess.findOneOrFailById(project.infoId);
      info.name = data.name ?? info.name;
      info.description = data.description ?? info.description;
      info.theme = data.theme ?? info.theme;
      info.genre = data.genre ?? info.genre;
      info.language = data.language ?? info.language;
      info.caption = data.caption ?? info.caption;
      await this.infoAccess.save(info);

      await this.dbAccess.commitTransaction();
    } catch (e) {
      await this.dbAccess.rollbackTransaction();
      throw e;
    }
  }

  public async projectApproval(projectId: string, userId: string) {
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
  }

  public async projectReady(projectId: string) {
    const projectUser = await this.projectUserAccess.findOneOrFail({
      where: {
        userId: this.cognitoUserId,
        projectId,
      },
    });
    projectUser.isReady = !projectUser.isReady;
    await this.projectUserAccess.save(projectUser);
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
    const projectUser = await this.projectUserAccess.findOneOrFail({
      where: { userId: this.cognitoUserId, projectId, role: Role.Owner },
    });
    if (projectUser.lyricsId !== null && projectUser.trackId !== null)
      throw new InternalServerError('original already exists');
    if (data.type === 'track' && projectUser.lyricsId === null)
      throw new BadRequestError('there is no lyrics');
    if (data.type === 'lyrics' && projectUser.trackId === null)
      throw new BadRequestError('there is no track');

    const project = await this.projectAccess.findOneByIdOrFail(projectId);

    if (data.type === 'track' && projectUser.lyricsId) {
      const lyrics = await this.lyricsAccess.findOneOrFailById(
        projectUser.lyricsId
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

      projectUser.trackId = newTrack.id;
      await this.projectUserAccess.save(projectUser);
    } else if (data.type === 'lyrics' && projectUser.trackId) {
      const track = await this.trackAccess.findOneOrFailById(
        projectUser.trackId
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

      projectUser.lyricsId = newLyrics.id;
      await this.projectUserAccess.save(projectUser);
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

      const project = await this.projectAccess.findOneByIdOrFail(id);
      if (project.infoId === null)
        throw new InternalServerError('info not found');
      const info = await this.infoAccess.findOneOrFailById(project.infoId);
      const newInfo = new InfoEntity();
      newInfo.name = info.name;
      newInfo.description = info.description;
      newInfo.theme = info.theme;
      newInfo.genre = info.genre;
      newInfo.language = info.language;
      newInfo.caption = info.caption;
      newInfo.coverFileUri = info.coverFileUri;
      const newInfoRes = await this.infoAccess.save(newInfo);

      project.status = Status.InProgress;
      project.infoId = newInfoRes.id;
      project.startedAt = new Date().toISOString();
      await this.projectAccess.save(project);

      const projectUsers = await this.projectUserAccess.findByProjectId(id);
      for (const pu of projectUsers) {
        if (pu.role === Role.Owner) continue;
        if (pu.isAccepted === true) {
          pu.role = Role.Collaborator;
          pu.isReady = false;
        } else pu.role = Role.Rejected;

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

      const project = await this.projectAccess.findOneByIdOrFail(id);
      project.status = Status.Published;
      await this.projectAccess.save(project);

      await this.dbAccess.commitTransaction();
    } catch (e) {
      await this.dbAccess.rollbackTransaction();
      throw e;
    }
  }

  public async updateProjectCover(id: string, data: PutProjectIdCoverRequest) {
    const project = await this.projectAccess.findOneByIdOrFail(id);
    if (project.infoId === null) throw new InternalServerError('no info found');

    const key = await this.awsService.s3Upload(
      data.file,
      `info/${project.infoId}`
    );
    const info = await this.infoAccess.findOneOrFailById(project.infoId);
    info.coverFileUri = key;
    await this.infoAccess.save(info);
  }

  public async getProjectChat(id: string): Promise<GetProjectIdChatResponse> {
    const chats = await this.chatAccess.find({ where: { projectId: id } });

    return chats.sort(compare('createdAt', 'desc'));
  }
}
