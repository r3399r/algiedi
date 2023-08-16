import { inject, injectable } from 'inversify';
import { In, Not } from 'typeorm';
import { CommentAccess } from 'src/access/CommentAccess';
import { DbAccess } from 'src/access/DbAccess';
import { FollowAccess } from 'src/access/FollowAccess';
import { LikeAccess } from 'src/access/LikeAccess';
import { ProjectUserAccess } from 'src/access/ProjectUserAccess';
import { UserAccess } from 'src/access/UserAccess';
import { ViewCreationExploreAccess } from 'src/access/ViewCreationExploreAccess';
import {
  GetExploreIdResponse,
  GetExploreResponse,
} from 'src/model/api/Explore';
import { Type } from 'src/model/constant/Creation';
import { Role, Status } from 'src/model/constant/Project';
import { compare } from 'src/util/compare';
import { cognitoSymbol } from 'src/util/LambdaSetup';
import { AwsService } from './AwsService';

/**
 * Service class for Explore
 */
@injectable()
export class ExploreService {
  @inject(cognitoSymbol)
  private readonly cognitoUserId!: string;

  @inject(DbAccess)
  private readonly dbAccess!: DbAccess;

  @inject(AwsService)
  private readonly awsService!: AwsService;

  @inject(ViewCreationExploreAccess)
  private readonly viewCreationExploreAccess!: ViewCreationExploreAccess;

  @inject(UserAccess)
  private readonly userAccess!: UserAccess;

  @inject(ProjectUserAccess)
  private readonly projectUserAccess!: ProjectUserAccess;

  @inject(LikeAccess)
  private readonly likeAccess!: LikeAccess;

  @inject(CommentAccess)
  private readonly commentAccess!: CommentAccess;

  @inject(FollowAccess)
  private readonly followAccess!: FollowAccess;

  public async cleanup() {
    await this.dbAccess.cleanup();
  }

  public async getExplore(): Promise<GetExploreResponse> {
    const creations = await this.viewCreationExploreAccess.find();
    const likes = await this.likeAccess.find({
      where: { creationId: In(creations.map((v) => v.id)) },
    });

    return await Promise.all(
      creations.map(async (v) => {
        const pu = await this.projectUserAccess.find({
          where: { projectId: v.id, role: Not(Role.Rejected) },
        });
        const author = await this.userAccess.find({
          where: { id: In(pu.map((v) => v.userId)) },
        });

        return {
          ...v,
          author: author.map((o) => ({
            ...o,
            avatarUrl: this.awsService.getS3SignedUrl(o.avatar),
          })),
          like:
            likes.find(
              (o) => o.userId === this.cognitoUserId && o.creationId === v.id
            ) !== undefined,
          fileUrl: this.awsService.getS3SignedUrl(v.fileUri),
          tabFileUrl: this.awsService.getS3SignedUrl(v.tabFileUri),
          coverFileUrl: this.awsService.getS3SignedUrl(v.coverFileUri),
        };
      })
    );
  }

  public async getExploreById(id: string): Promise<GetExploreIdResponse> {
    const creation = await this.viewCreationExploreAccess.findOneByIdOrFail(id);

    let user = [await this.userAccess.findOneByIdOrFail(creation.userId)];

    let inspiredIds: string[] = [];
    if (creation.inspiredId && creation.type !== Type.Song)
      inspiredIds.push(creation.inspiredId);
    else if (
      creation.type === Type.Song &&
      creation.projectStatus === Status.Published
    ) {
      const pu = await this.projectUserAccess.find({
        where: { projectId: creation.id, role: Not(Role.Rejected) },
      });
      inspiredIds = [
        ...pu.filter((v) => v.lyricsId !== null).map((v) => v.lyricsId ?? 'xx'),
        ...pu.filter((v) => v.trackId !== null).map((v) => v.trackId ?? 'xx'),
      ].filter((v) => v !== 'xx');
      user = await this.userAccess.find({
        where: { id: In(pu.map((v) => v.userId)) },
      });
    }
    const inspired = await this.viewCreationExploreAccess.find({
      where: { id: In(inspiredIds) },
    });

    const inspiration = await this.viewCreationExploreAccess.find({
      where: { inspiredId: id },
    });
    if (
      creation.projectStatus === Status.Published &&
      creation.type !== Type.Song
    )
      inspiration.push(
        await this.viewCreationExploreAccess.findOneByIdOrFail(
          creation.projectId
        )
      );

    const likes = await this.likeAccess.find({ where: { creationId: id } });
    const comments = await this.commentAccess.find({
      where: { creationId: id },
    });
    const commentersId = new Set(comments.map((v) => v.userId));
    const commenters = await Promise.all(
      [...commentersId].map(
        async (v) => await this.userAccess.findOneByIdOrFail(v)
      )
    );

    const myFollowees = await this.followAccess.find({
      where: { followerId: this.cognitoUserId },
    });
    const author = user.map((v) => {
      let following: boolean | null =
        myFollowees.find((o) => o.followeeId === v.id) !== undefined
          ? true
          : false;
      if (v.id === this.cognitoUserId) following = null;

      return { ...v, following };
    });

    return {
      ...creation,
      fileUrl: this.awsService.getS3SignedUrl(creation.fileUri),
      tabFileUrl: this.awsService.getS3SignedUrl(creation.tabFileUri),
      coverFileUrl: this.awsService.getS3SignedUrl(creation.coverFileUri),
      author: author.map((o) => ({
        ...o,
        avatarUrl: this.awsService.getS3SignedUrl(o.avatar),
      })),
      inspired: inspired.map((v) => ({
        ...v,
        fileUrl: this.awsService.getS3SignedUrl(v.fileUri),
        tabFileUrl: this.awsService.getS3SignedUrl(v.tabFileUri),
        coverFileUrl: this.awsService.getS3SignedUrl(v.coverFileUri),
      })),
      inspiration: inspiration.map((v) => ({
        ...v,
        fileUrl: this.awsService.getS3SignedUrl(v.fileUri),
        tabFileUrl: this.awsService.getS3SignedUrl(v.tabFileUri),
        coverFileUrl: this.awsService.getS3SignedUrl(v.coverFileUri),
      })),
      like: likes.find((o) => o.userId === this.cognitoUserId) !== undefined,
      likeCount: likes.length,
      comments: comments
        .map((v) => ({
          user:
            commenters
              .map((o) => ({
                ...o,
                avatarUrl: this.awsService.getS3SignedUrl(o.avatar),
              }))
              .find((o) => o.id === v.userId) ?? null,
          comment: v.comment,
          timestamp: v.createdAt,
        }))
        .sort(compare('timestamp', 'desc')),
    };
  }
}
