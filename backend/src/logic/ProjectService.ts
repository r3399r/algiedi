import { inject, injectable } from 'inversify';
import { DbAccess } from 'src/access/DbAccess';
import { LyricsAccess } from 'src/access/LyricsAccess';
import { ProjectAccess } from 'src/access/ProjectAccess';
import { TrackAccess } from 'src/access/TrackAccess';
import { UserAccess } from 'src/access/UserAccess';
import { ViewCreationAccess } from 'src/access/ViewCreationAccess';
import { GetProjectResponse, PutProjectRequest } from 'src/model/api/Project';
import { Type } from 'src/model/constant/Creation';
import { Project } from 'src/model/entity/ProjectEntity';
import {
  BadRequestError,
  InternalServerError,
  UnauthorizedError,
} from 'src/model/error';
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

  @inject(TrackAccess)
  private readonly trackAccess!: TrackAccess;

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
        if (creations.length === 0)
          throw new InternalServerError('creations should exist');

        const project: Project = {
          id: pid,
          status: creations[0].projectStatus,
          createdAt: creations[0].projectCreatedAt,
          updatedAt: creations[0].projectUpdatedAt,
        };

        return {
          ...project,
          creation: creations
            .map((c) => ({
              ...c,
              fileUrl: this.awsService.getS3SignedUrl(c.fileUri),
              tabFileUrl: this.awsService.getS3SignedUrl(c.tabFileUri),
              coverFileUrl: this.awsService.getS3SignedUrl(c.coverFileUri),
            }))
            .sort(compare('createdAt')),
        };
      })
    );
  }

  public async updateProject(
    id: string,
    data: PutProjectRequest
  ): Promise<void> {
    const creation = await this.viewCreationAccess.findOne({
      where: {
        projectId: id,
        userId: this.cognitoUserId,
        isOriginal: true,
      },
    });
    if (creation === null) throw new BadRequestError('lyrics/track not found');

    if (creation.type === Type.Track) {
      const track = await this.trackAccess.findOneById(creation.id);
      if (track === null) throw new InternalServerError('track not found');

      track.name = data.name ?? track.name;
      track.description = data.description ?? track.description;
      track.theme = data.theme ?? track.theme;
      track.genre = data.genre ?? track.genre;
      track.language = data.language ?? track.language;
      track.caption = data.caption ?? track.caption;
      await this.trackAccess.save(track);
    } else if (creation.type === Type.Lyrics) {
      const lyrics = await this.lyricsAccess.findOneById(creation.id);
      if (lyrics === null) throw new InternalServerError('lyrics not found');

      lyrics.name = data.name ?? lyrics.name;
      lyrics.description = data.description ?? lyrics.description;
      lyrics.theme = data.theme ?? lyrics.theme;
      lyrics.genre = data.genre ?? lyrics.genre;
      lyrics.language = data.language ?? lyrics.language;
      lyrics.caption = data.caption ?? lyrics.caption;
      await this.lyricsAccess.save(lyrics);
    } else throw new InternalServerError('creation type not defined');
  }

  public async projectAppoval(projectId: string, creationId: string) {
    const creations = await this.viewCreationAccess.findByProjectId(projectId);

    // check user is owner
    const mainCreation = creations.find((v) => v.isOriginal === true);
    if (mainCreation?.userId !== this.cognitoUserId)
      throw new UnauthorizedError('Only owner can set approval');

    const targetCreation = creations.find((v) => v.id === creationId);

    if (targetCreation?.type === Type.Track) {
      const track = await this.trackAccess.findOneById(targetCreation.id);
      if (track === null) throw new InternalServerError('track not found');

      track.approval = !track.approval;
      await this.trackAccess.save(track);
    } else if (targetCreation?.type === Type.Lyrics) {
      const lyrics = await this.lyricsAccess.findOneById(targetCreation.id);
      if (lyrics === null) throw new InternalServerError('lyrics not found');

      lyrics.approval = !lyrics.approval;
      await this.lyricsAccess.save(lyrics);
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
}
