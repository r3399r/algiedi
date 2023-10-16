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
  GetExploreParams,
  GetExploreResponse,
} from 'src/model/api/Explore';
import { Type } from 'src/model/constant/Creation';
import { Role, Status } from 'src/model/constant/Project';
import { ProjectUser } from 'src/model/entity/ProjectUserEntity';
import { Pagination } from 'src/model/Pagination';
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

  public async getExplore(
    params: GetExploreParams | null
  ): Promise<Pagination<GetExploreResponse>> {
    const limit = params?.limit ? Number(params.limit) : 50;
    const offset = params?.offset ? Number(params.offset) : 0;

    const type = params?.type.split(',');

    const [creations, count] =
      await this.viewCreationExploreAccess.findAndCount({
        where: type ? { type: In(type) } : undefined,
        order: { createdAt: 'desc' },
        take: limit,
        skip: offset,
      });

    // find like list or not if auth
    let likedId: Set<string> | null = null;
    if (this.cognitoUserId !== '') {
      const likes = await this.likeAccess.find({
        where: { userId: this.cognitoUserId },
      });
      likedId = new Set(likes.map((v) => v.creationId));
    }

    // find project-user pair by project ids
    let pu: ProjectUser[] | null = null;
    const projectIds: string[] = creations
      .filter((v) => v.type === Type.Song && v.projectId !== null)
      .map((v) => v.projectId ?? '');
    if (projectIds.length > 0)
      pu = await this.projectUserAccess.find({
        where: { projectId: In(projectIds) },
      });

    const data = await Promise.all(
      creations.map(async (v) => {
        const fileUrl = this.awsService.getS3SignedUrl(v.fileUri);
        const tabFileUrl = this.awsService.getS3SignedUrl(v.tabFileUri);
        const coverFileUrl = this.awsService.getS3SignedUrl(
          v.info.coverFileUri
        );

        let user: GetExploreResponse[0]['user'] = [];
        if (v.type !== Type.Song && v.user !== null)
          user = [
            {
              ...v.user,
              avatarUrl: this.awsService.getS3SignedUrl(v.user.avatar),
            },
          ];
        else if (pu !== null)
          user = pu.map((o) => ({
            ...o.user,
            avatarUrl: this.awsService.getS3SignedUrl(o.user.avatar),
          }));

        return {
          ...v,
          fileUrl,
          tabFileUrl,
          user,
          info: { ...v.info, coverFileUrl },
          like: likedId === null ? false : likedId.has(v.id),
        };
      })
    );

    return { data, paginate: { limit, offset, count } };
  }

  public async getFeaturedExplore() {
    return {};
  }

  public async getExploreById(id: string): Promise<GetExploreIdResponse> {
    const creation = await this.viewCreationExploreAccess.findOneByIdOrFail(id);
    const fileUrl = this.awsService.getS3SignedUrl(creation.fileUri);
    const tabFileUrl = this.awsService.getS3SignedUrl(creation.tabFileUri);
    const coverFileUrl = this.awsService.getS3SignedUrl(
      creation.info.coverFileUri
    );

    let myFolloweeId: Set<string> | null = null;
    if (this.cognitoUserId !== '') {
      const myFollowees = await this.followAccess.find({
        where: { followerId: this.cognitoUserId },
      });
      myFolloweeId = new Set(myFollowees.map((v) => v.followeeId));
    }

    let user: GetExploreIdResponse['user'] = [];
    if (creation.type !== Type.Song && creation.user !== null)
      user = [
        {
          ...creation.user,
          avatarUrl: this.awsService.getS3SignedUrl(creation.user.avatar),
          following:
            myFolloweeId === null ? null : myFolloweeId.has(creation.user.id),
        },
      ];

    // inspired
    // lyrics & track would be only inspired by one creation
    // song would be inspired by authors' creations
    const inspiredId = new Set<string>();
    if (creation.type !== Type.Song && creation.inspiredId)
      inspiredId.add(creation.inspiredId);
    else if (
      creation.type === Type.Song &&
      creation.project?.status === Status.Published
    ) {
      const pu = await this.projectUserAccess.find({
        where: { projectId: creation.id, role: Not(Role.Rejected) },
      });
      for (const p of pu) {
        if (p.lyricsId) inspiredId.add(p.lyricsId);
        if (p.trackId) inspiredId.add(p.trackId);
      }
      user = pu.map((o) => ({
        ...o.user,
        avatarUrl: this.awsService.getS3SignedUrl(o.user.avatar),
        following: myFolloweeId === null ? null : myFolloweeId.has(o.user.id),
      }));
    }
    const inspired = await this.viewCreationExploreAccess.find({
      where: { id: In([...inspiredId]) },
    });

    // inspiration
    // a creation may have multiple inspirations
    // and lyrics/track must include its published project as inspiration
    const inspiration = await this.viewCreationExploreAccess.find({
      where: { inspiredId: id },
    });
    if (
      creation.project?.status === Status.Published &&
      creation.type !== Type.Song
    )
      inspiration.push(
        await this.viewCreationExploreAccess.findOneByIdOrFail(
          creation.project.id
        )
      );

    const [likes, comments] = await Promise.all([
      this.likeAccess.find({
        where: { creationId: id },
      }),
      this.commentAccess.find({
        where: { creationId: id },
        order: { createdAt: 'desc' },
      }),
    ]);

    return {
      ...creation,
      fileUrl,
      tabFileUrl,
      user,
      info: { ...creation.info, coverFileUrl },
      inspired: inspired.map((v) => ({
        ...v,
        fileUrl: this.awsService.getS3SignedUrl(v.fileUri),
        tabFileUrl: this.awsService.getS3SignedUrl(v.tabFileUri),
        coverFileUrl: this.awsService.getS3SignedUrl(v.info.coverFileUri),
      })),
      inspiration: inspiration.map((v) => ({
        ...v,
        fileUrl: this.awsService.getS3SignedUrl(v.fileUri),
        tabFileUrl: this.awsService.getS3SignedUrl(v.tabFileUri),
        coverFileUrl: this.awsService.getS3SignedUrl(v.info.coverFileUri),
      })),
      like: likes.find((o) => o.userId === this.cognitoUserId) !== undefined,
      likeCount: likes.length,
      comments: comments.map((v) => ({
        user: {
          ...v.user,
          avatarUrl: this.awsService.getS3SignedUrl(v.user.avatar),
        },
        comment: v.comment,
        timestamp: v.createdAt,
      })),
    };
  }
}
