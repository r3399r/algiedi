import { inject, injectable } from 'inversify';
import { DbAccess } from 'src/access/DbAccess';
import { LyricsAccess } from 'src/access/LyricsAccess';
import { LyricsHistoryAccess } from 'src/access/LyricsHistoryAccess';
import { ProjectAccess } from 'src/access/ProjectAccess';
import { TrackAccess } from 'src/access/TrackAccess';
import { TrackHistoryAccess } from 'src/access/TrackHistoryAccess';
import { UserAccess } from 'src/access/UserAccess';
import { ViewCreationAccess } from 'src/access/ViewCreationAccess';
import {
  GetProjectResponse,
  PostProjectIdOriginalRequest,
  PutProjectRequest,
} from 'src/model/api/Project';
import { CollaborateStatus, Type } from 'src/model/constant/Creation';
import { Lyrics, LyricsEntity } from 'src/model/entity/LyricsEntity';
import { LyricsHistoryEntity } from 'src/model/entity/LyricsHistoryEntity';
import { Project } from 'src/model/entity/ProjectEntity';
import { Track, TrackEntity } from 'src/model/entity/TrackEntity';
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

  @inject(ViewCreationAccess)
  private readonly viewCreationAccess!: ViewCreationAccess;

  public async cleanup() {
    await this.dbAccess.cleanup();
  }

  public async getProjects(): Promise<GetProjectResponse> {
    const myCreations = await this.viewCreationAccess.findByUserId(
      this.cognitoUserId
    );
    const myProjectIds = new Set(myCreations.map((v) => v.projectId));

    return await Promise.all(
      [...myProjectIds].map(async (pid) => {
        const creations = await this.viewCreationAccess.findByProjectId(pid);

        const detailedCreations: DetailedCreation[] = creations.map((c) => ({
          ...c,
          fileUrl: this.awsService.getS3SignedUrl(c.fileUri),
          tabFileUrl: this.awsService.getS3SignedUrl(c.tabFileUri),
          coverFileUrl: this.awsService.getS3SignedUrl(c.coverFileUri),
        }));

        let mainTrack: DetailedCreation | null = null;
        let mainLyrics: DetailedCreation | null = null;
        const inspiration: DetailedCreation[] = [];
        for (const c of detailedCreations)
          if (c.status === CollaborateStatus.Main && c.type === Type.Track)
            mainTrack = c;
          else if (
            c.status === CollaborateStatus.Main &&
            c.type === Type.Lyrics
          )
            mainLyrics = c;
          else inspiration.push(c);

        const project: Project = {
          id: pid,
          status: creations[0].projectStatus,
          createdAt: creations[0].projectCreatedAt,
          updatedAt: creations[0].projectUpdatedAt,
        };

        return {
          ...project,
          mainTrack,
          mainLyrics,
          inspiration: inspiration.sort(compare('createdAt')),
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

      const creations = await this.viewCreationAccess.find({
        where: {
          projectId: id,
          userId: this.cognitoUserId,
          status: CollaborateStatus.Main,
        },
      });

      if (creations.length === 0) throw new BadRequestError('no project found');

      for (const c of creations)
        if (c.type === Type.Track) {
          const track = await this.trackAccess.findOneById(c.id);
          if (track === null) throw new InternalServerError('track not found');

          track.name = data.name ?? track.name;
          track.description = data.description ?? track.description;
          track.theme = data.theme ?? track.theme;
          track.genre = data.genre ?? track.genre;
          track.language = data.language ?? track.language;
          track.caption = data.caption ?? track.caption;
          await this.trackAccess.save(track);
        } else if (c.type === Type.Lyrics) {
          const lyrics = await this.lyricsAccess.findOneById(c.id);
          if (lyrics === null)
            throw new InternalServerError('lyrics not found');

          lyrics.name = data.name ?? lyrics.name;
          lyrics.description = data.description ?? lyrics.description;
          lyrics.theme = data.theme ?? lyrics.theme;
          lyrics.genre = data.genre ?? lyrics.genre;
          lyrics.language = data.language ?? lyrics.language;
          lyrics.caption = data.caption ?? lyrics.caption;
          await this.lyricsAccess.save(lyrics);
        }

      await this.dbAccess.commitTransaction();
    } catch (e) {
      await this.dbAccess.rollbackTransaction();
      throw e;
    }
  }

  private setApproval<T extends Lyrics | Track>(creation: T) {
    if (creation.status === CollaborateStatus.Inspired)
      creation.status = CollaborateStatus.Approved;
    else if (creation.status === CollaborateStatus.Approved)
      creation.status = CollaborateStatus.Inspired;
    else throw new InternalServerError('creation status error');

    return creation;
  }

  public async projectApproval(projectId: string, creationId: string) {
    const creations = await this.viewCreationAccess.findByProjectId(projectId);

    // check user is owner
    const mainCreation = creations.find(
      (v) => v.status === CollaborateStatus.Main
    );
    if (mainCreation?.userId !== this.cognitoUserId)
      throw new UnauthorizedError('Only owner can set approval');

    // update status
    const targetCreation = creations.find((v) => v.id === creationId);
    if (targetCreation?.type === Type.Track) {
      const track = await this.trackAccess.findOneById(targetCreation.id);
      if (track === null) throw new InternalServerError('track not found');

      await this.trackAccess.save(this.setApproval(track));
    } else if (targetCreation?.type === Type.Lyrics) {
      const lyrics = await this.lyricsAccess.findOneById(targetCreation.id);
      if (lyrics === null) throw new InternalServerError('lyrics not found');

      await this.lyricsAccess.save(this.setApproval(lyrics));
    } else throw new InternalServerError('creation not found');
  }

  public async setLastProject(id: string) {
    const project = await this.projectAccess.findOneById(id);
    if (project === null) throw new BadRequestError('project not found');

    const user = await this.userAccess.findOneById(this.cognitoUserId);
    if (user === null) throw new InternalServerError('user not found');

    user.lastProjectId = id;
    await this.userAccess.save(user);
  }

  public async addOriginal(
    projectId: string,
    data: PostProjectIdOriginalRequest
  ) {
    const creation = await this.viewCreationAccess.find({
      where: { projectId, status: CollaborateStatus.Main },
    });
    if (creation.length !== 1)
      throw new InternalServerError('there should be only 1 original');
    if (data.type === 'track' && creation[0].type === Type.Track)
      throw new InternalServerError('original track already exists');
    if (data.type === 'lyrics' && creation[0].type === Type.Lyrics)
      throw new InternalServerError('original lyrics already exists');

    if (data.type === 'track') {
      const lyrics = creation[0];
      const track = new TrackEntity();
      track.userId = this.cognitoUserId;
      track.name = lyrics.name;
      track.description = lyrics.description;
      track.theme = lyrics.theme;
      track.genre = lyrics.genre;
      track.language = lyrics.language;
      track.caption = lyrics.caption;
      track.projectId = lyrics.projectId;
      track.status = CollaborateStatus.Main;
      track.coverFileUri = lyrics.coverFileUri;

      const trackHistory = new TrackHistoryEntity();
      trackHistory.trackId = track.id;
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
    } else if (data.type === 'lyrics') {
      const track = creation[0];
      const lyrics = new LyricsEntity();
      lyrics.userId = this.cognitoUserId;
      lyrics.name = track.name;
      lyrics.description = track.description;
      lyrics.theme = track.theme;
      lyrics.genre = track.genre;
      lyrics.language = track.language;
      lyrics.caption = track.caption;
      lyrics.projectId = track.projectId;
      lyrics.status = CollaborateStatus.Main;
      lyrics.coverFileUri = track.coverFileUri;
      const newLyrics = await this.lyricsAccess.save(lyrics);

      // upload lyrics
      const lyricsHistory = new LyricsHistoryEntity();
      lyricsHistory.lyricsId = newLyrics.id;
      lyricsHistory.content = data.lyrics;
      await this.lyricsHistoryAccess.save(lyricsHistory);
    }
  }
}
