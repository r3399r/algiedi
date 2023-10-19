import { subWeeks } from 'date-fns';
import { inject, injectable } from 'inversify';
import {
  Between,
  FindOperator,
  FindOptionsWhere,
  In,
  IsNull,
  LessThan,
  Like,
  MoreThan,
  Not,
} from 'typeorm';
import { CommentAccess } from 'src/access/CommentAccess';
import { DbAccess } from 'src/access/DbAccess';
import { FollowAccess } from 'src/access/FollowAccess';
import { LikeAccess } from 'src/access/LikeAccess';
import { LyricsAccess } from 'src/access/LyricsAccess';
import { ProjectAccess } from 'src/access/ProjectAccess';
import { ProjectUserAccess } from 'src/access/ProjectUserAccess';
import { TrackAccess } from 'src/access/TrackAccess';
import { ViewCreationExploreAccess } from 'src/access/ViewCreationExploreAccess';
import {
  GetExploreFeaturedResponse,
  GetExploreIdResponse,
  GetExploreParams,
  GetExploreResponse,
} from 'src/model/api/Explore';
import { Type } from 'src/model/constant/Creation';
import { Role, Status } from 'src/model/constant/Project';
import { ProjectUser } from 'src/model/entity/ProjectUserEntity';
import { ViewCreationExplore } from 'src/model/entity/ViewCreationExploreEntity';
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

  @inject(ProjectUserAccess)
  private readonly projectUserAccess!: ProjectUserAccess;

  @inject(LikeAccess)
  private readonly likeAccess!: LikeAccess;

  @inject(CommentAccess)
  private readonly commentAccess!: CommentAccess;

  @inject(FollowAccess)
  private readonly followAccess!: FollowAccess;

  @inject(LyricsAccess)
  private readonly lyricsAccess!: LyricsAccess;

  @inject(TrackAccess)
  private readonly trackAccess!: TrackAccess;

  @inject(ProjectAccess)
  private readonly projectAccess!: ProjectAccess;

  public async cleanup() {
    await this.dbAccess.cleanup();
  }

  public async getExplore(
    params: GetExploreParams | null
  ): Promise<Pagination<GetExploreResponse>> {
    const limit = params?.limit ? Number(params.limit) : 50;
    const offset = params?.offset ? Number(params.offset) : 0;

    const type = params?.type?.split(',') ?? [
      Type.Lyrics,
      Type.Track,
      Type.Song,
    ];
    const findOptionsWhere: FindOptionsWhere<ViewCreationExplore>[] = [];
    const infoFilter = {
      genre: params?.genre ? Like(`%${params.genre}%`) : undefined,
      theme: params?.theme ? Like(`%${params.theme}%`) : undefined,
    };
    const projectFilter =
      params?.status === 'null' ? IsNull() : { status: params?.status };
    let paginateFilter: FindOperator<string> | undefined = undefined;
    if (params?.begin && params.end)
      paginateFilter = Between(
        new Date(params.begin).toISOString(),
        new Date(params.end).toISOString()
      );
    else if (params?.begin)
      paginateFilter = MoreThan(new Date(params.begin).toISOString());
    else if (params?.end)
      paginateFilter = LessThan(new Date(params.end).toISOString());

    if (type.includes(Type.Lyrics))
      findOptionsWhere.push({
        type: Type.Lyrics,
        info: infoFilter,
        project: projectFilter,
        createdAt: paginateFilter,
      });
    if (type.includes(Type.Track))
      findOptionsWhere.push({
        type: Type.Track,
        info: infoFilter,
        project: projectFilter,
        createdAt: paginateFilter,
      });
    if (type.includes(Type.Song))
      findOptionsWhere.push({
        type: Type.Song,
        info: infoFilter,
        project: { status: Status.Published, publishedAt: paginateFilter },
      });

    const [creations, count] =
      await this.viewCreationExploreAccess.findAndCount({
        where: findOptionsWhere,
        order: type.includes(Type.Song)
          ? { project: { publishedAt: 'desc' } }
          : { createdAt: 'desc' },
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
      .filter(
        (v) => v.type === Type.Song && v.project?.status === Status.Published
      )
      .map((v) => v.projectId ?? '');
    if (projectIds.length > 0)
      pu = await this.projectUserAccess.find({
        where: { projectId: In(projectIds), role: Not(Role.Rejected) },
      });

    const data = creations.map((v) => {
      const fileUrl = this.awsService.getS3SignedUrl(v.fileUri);
      const tabFileUrl = this.awsService.getS3SignedUrl(v.tabFileUri);
      const coverFileUrl = this.awsService.getS3SignedUrl(v.info.coverFileUri);

      let user: GetExploreResponse[0]['user'] = [];
      if (v.type !== Type.Song && v.user !== null)
        user = [
          {
            ...v.user,
            avatarUrl: this.awsService.getS3SignedUrl(v.user.avatar),
          },
        ];
      else if (pu !== null)
        user = pu
          .filter((o) => o.projectId === v.projectId)
          .map((o) => ({
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
    });

    return { data, paginate: { limit, offset, count } };
  }

  public async getFeaturedExplore(): Promise<GetExploreFeaturedResponse> {
    const featuredSong = await this.projectAccess.find({
      order: { countLike: 'desc' },
      take: 12,
    });
    const featuredLyrics = await this.lyricsAccess.find({
      where: { createdAt: MoreThan(subWeeks(new Date(), 8).toISOString()) },
      order: { countLike: 'desc' },
    });
    const featuredTrack = await this.trackAccess.find({
      where: { createdAt: MoreThan(subWeeks(new Date(), 8).toISOString()) },
      order: { countLike: 'desc' },
    });

    return {
      song: featuredSong.map((v) => ({
        ...v,
        info: {
          ...v.info,
          coverFileUrl: this.awsService.getS3SignedUrl(v.info.coverFileUri),
        },
      })),
      lyrics: {
        thisWeek: featuredLyrics
          .filter((v) => new Date(v.createdAt ?? '') >= subWeeks(new Date(), 1))
          .slice(0, 6)
          .map((v) => ({
            ...v,
            info: {
              ...v.info,
              coverFileUrl: this.awsService.getS3SignedUrl(v.info.coverFileUri),
            },
          })),
        thisMonth: featuredLyrics
          .filter((v) => new Date(v.createdAt ?? '') >= subWeeks(new Date(), 4))
          .slice(0, 6)
          .map((v) => ({
            ...v,
            info: {
              ...v.info,
              coverFileUrl: this.awsService.getS3SignedUrl(v.info.coverFileUri),
            },
          })),
        lastMonth: featuredLyrics
          .filter((v) => new Date(v.createdAt ?? '') <= subWeeks(new Date(), 4))
          .slice(0, 6)
          .map((v) => ({
            ...v,
            info: {
              ...v.info,
              coverFileUrl: this.awsService.getS3SignedUrl(v.info.coverFileUri),
            },
          })),
      },
      track: {
        thisWeek: featuredTrack
          .filter((v) => new Date(v.createdAt ?? '') >= subWeeks(new Date(), 1))
          .slice(0, 6)
          .map((v) => ({
            ...v,
            info: {
              ...v.info,
              coverFileUrl: this.awsService.getS3SignedUrl(v.info.coverFileUri),
            },
          })),
        thisMonth: featuredTrack
          .filter((v) => new Date(v.createdAt ?? '') >= subWeeks(new Date(), 4))
          .slice(0, 6)
          .map((v) => ({
            ...v,
            info: {
              ...v.info,
              coverFileUrl: this.awsService.getS3SignedUrl(v.info.coverFileUri),
            },
          })),
        lastMonth: featuredTrack
          .filter((v) => new Date(v.createdAt ?? '') <= subWeeks(new Date(), 4))
          .slice(0, 6)
          .map((v) => ({
            ...v,
            info: {
              ...v.info,
              coverFileUrl: this.awsService.getS3SignedUrl(v.info.coverFileUri),
            },
          })),
      },
    };
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
