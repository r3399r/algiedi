import { S3 } from 'aws-sdk';
import { inject, injectable } from 'inversify';
import { DbAccess } from 'src/access/DbAccess';
import { LyricsAccess } from 'src/access/LyricsAccess';
import { ProjectAccess } from 'src/access/ProjectAccess';
import { TrackAccess } from 'src/access/TrackAccess';
import { GetProjectResponse, PutProjectRequest } from 'src/model/api/Project';
import { ProjectEntity } from 'src/model/entity/ProjectEntity';
import { UnauthorizedError } from 'src/model/error';
import { cognitoSymbol } from 'src/util/LambdaSetup';

/**
 * Service class for Project
 */
@injectable()
export class ProjectService {
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

  private getS3SignedUrl(uri: string | null) {
    const bucket = `${process.env.PROJECT}-${process.env.ENVR}-storage`;

    return uri === null
      ? null
      : this.s3.getSignedUrl('getObject', {
          Bucket: bucket,
          Key: uri,
        });
  }

  public async getProjects(): Promise<GetProjectResponse> {
    const projects = await this.projectAccess.findByUserId(this.cognitoUserId);

    return await Promise.all(
      projects.map(async (p) => {
        const lyrics = await this.lyricsAccess.findByProjectId(p.id);
        const track = await this.trackAccess.findByProjectId(p.id);

        return {
          ...p,
          coverFileUrl: this.getS3SignedUrl(p.coverFileUri),
          lyrics,
          track: track.map((t) => ({
            ...t,
            fileUrl: this.getS3SignedUrl(t.fileUri),
            tabFileUrl: this.getS3SignedUrl(t.tabFileUri),
          })),
        };
      })
    );
  }

  public async updateProject(
    id: string,
    data: PutProjectRequest
  ): Promise<void> {
    const oldProject = await this.projectAccess.findOneById(id);
    if (oldProject === null || oldProject.userId !== this.cognitoUserId)
      throw new UnauthorizedError('unauthorized');

    const project = new ProjectEntity();
    project.id = id;
    project.name = data.name ?? oldProject.name;
    project.description = data.description ?? oldProject.description;
    project.theme = data.theme ?? oldProject.theme;
    project.genre = data.genre ?? oldProject.genre;
    project.language = data.language ?? oldProject.language;
    project.caption = data.caption ?? oldProject.caption;

    await this.projectAccess.save(project);
  }
}
