import { inject, injectable } from 'inversify';
import { In, IsNull, Not } from 'typeorm';
import { DbAccess } from 'src/access/DbAccess';
import { FollowAccess } from 'src/access/FollowAccess';
import { LikeAccess } from 'src/access/LikeAccess';
import { ProjectUserAccess } from 'src/access/ProjectUserAccess';
import { UserAccess } from 'src/access/UserAccess';
import { ViewCreationExploreAccess } from 'src/access/ViewCreationExploreAccess';
import {
  GetMeExhibitsFollowParams,
  GetMeExhibitsFollowResponse,
  GetMeExhibitsInspirationPramas,
  GetMeExhibitsInspirationResponse,
  GetMeExhibitsLikeParams,
  GetMeExhibitsLikeResponse,
  GetMeExhibitsOriginalPramas,
  GetMeExhibitsOriginalResponse,
  GetMeExhibitsPublishedParams,
  GetMeExhibitsPublishedResponse,
  GetMeResponse,
  PutMeRequest,
  PutMeResponse,
} from 'src/model/api/Me';
import { Type } from 'src/model/constant/Creation';
import { Role, Status } from 'src/model/constant/Project';
import { InternalServerError } from 'src/model/error';
import { Pagination } from 'src/model/Pagination';
import { cognitoSymbol } from 'src/util/LambdaSetup';
import { AwsService } from './AwsService';

/**
 * Service class for Me
 */
@injectable()
export class MeService {
  @inject(cognitoSymbol)
  private readonly cognitoUserId!: string;

  @inject(DbAccess)
  private readonly dbAccess!: DbAccess;

  @inject(UserAccess)
  private readonly userAccess!: UserAccess;

  @inject(ProjectUserAccess)
  private readonly projectUserAccess!: ProjectUserAccess;

  @inject(ViewCreationExploreAccess)
  private readonly viewCreationExploreAccess!: ViewCreationExploreAccess;

  @inject(LikeAccess)
  private readonly likeAccess!: LikeAccess;

  @inject(FollowAccess)
  private readonly followAccess!: FollowAccess;

  @inject(AwsService)
  private readonly awsService!: AwsService;

  public async cleanup() {
    await this.dbAccess.cleanup();
  }

  public async getMe(): Promise<GetMeResponse> {
    const user = await this.userAccess.findOneByIdOrFail(this.cognitoUserId);

    return { ...user, avatarUrl: this.awsService.getS3SignedUrl(user.avatar) };
  }

  public async updateMe(data: PutMeRequest): Promise<PutMeResponse> {
    const user = await this.userAccess.findOneByIdOrFail(this.cognitoUserId);

    user.role = data.role ?? user.role;
    user.language = data.language ?? user.language;
    user.bio = data.bio ?? user.bio;
    user.age =
      data.age !== undefined
        ? data.age === ''
          ? null
          : Number(data.age)
        : user.age;
    user.region = data.region ?? user.region;
    user.tag = data.tag ?? user.tag;
    user.facebook = data.facebook ?? user.facebook;
    user.instagram = data.instagram ?? user.instagram;
    user.youtube = data.youtube ?? user.youtube;
    user.soundcloud = data.soundcloud ?? user.soundcloud;
    await this.userAccess.save(user);

    return { ...user, avatarUrl: this.awsService.getS3SignedUrl(user.avatar) };
  }

  public async getPublished(
    params: GetMeExhibitsPublishedParams | null
  ): Promise<Pagination<GetMeExhibitsPublishedResponse>> {
    const limit = params?.limit ? Number(params.limit) : 20;
    const offset = params?.offset ? Number(params.offset) : 0;

    const [pu, count] = await this.projectUserAccess.findAndCount({
      where: {
        userId: this.cognitoUserId,
        project: { status: Status.Published },
        role: Not(Role.Rejected),
      },
      take: limit,
      skip: offset,
    });

    return {
      data: pu.map((v) => ({
        ...v.project,
        info: {
          ...v.project.info,
          coverFileUrl: this.awsService.getS3SignedUrl(
            v.project.info.coverFileUri
          ),
        },
      })),
      paginate: { limit, offset, count },
    };
  }

  public async getOriginal(
    params: GetMeExhibitsOriginalPramas | null
  ): Promise<Pagination<GetMeExhibitsOriginalResponse>> {
    const limit = params?.limit ? Number(params.limit) : 20;
    const offset = params?.offset ? Number(params.offset) : 0;

    const [vc, count] = await this.viewCreationExploreAccess.findAndCount({
      where: {
        userId: this.cognitoUserId,
        type: params?.type ? (params.type as Type) : Not(Type.Song),
        inspiredId: IsNull(),
      },
      take: limit,
      skip: offset,
    });

    return {
      data: vc.map((v) => ({
        ...v,
        info: {
          ...v.info,
          coverFileUrl: this.awsService.getS3SignedUrl(v.info.coverFileUri),
        },
      })),
      paginate: { limit, offset, count },
    };
  }

  public async getInspiration(
    params: GetMeExhibitsInspirationPramas | null
  ): Promise<Pagination<GetMeExhibitsInspirationResponse>> {
    const limit = params?.limit ? Number(params.limit) : 20;
    const offset = params?.offset ? Number(params.offset) : 0;

    const [vc, count] = await this.viewCreationExploreAccess.findAndCount({
      where: {
        userId: this.cognitoUserId,
        type: params?.type ? (params.type as Type) : Not(Type.Song),
        inspiredId: Not(IsNull()),
      },
      take: limit,
      skip: offset,
    });

    return {
      data: vc.map((v) => ({
        ...v,
        info: {
          ...v.info,
          coverFileUrl: this.awsService.getS3SignedUrl(v.info.coverFileUri),
        },
      })),
      paginate: { limit, offset, count },
    };
  }

  public async getLikeList(
    params: GetMeExhibitsLikeParams | null
  ): Promise<Pagination<GetMeExhibitsLikeResponse>> {
    const limit = params?.limit ? Number(params.limit) : 20;
    const offset = params?.offset ? Number(params.offset) : 0;

    const [like, count] = await this.likeAccess.findAndCount({
      where: {
        userId: this.cognitoUserId,
      },
      take: limit,
      skip: offset,
    });
    const relatedCreationIds = new Set(like.map((v) => v.creationId));
    const vc = await this.viewCreationExploreAccess.find({
      where: { id: In([...relatedCreationIds]) },
    });

    return {
      data: like.map((v) => {
        const c = vc.find((o) => o.id === v.creationId);
        if (c === undefined) throw new InternalServerError('unexpected');

        return {
          ...v,
          creation: {
            ...c,
            info: {
              ...c.info,
              coverFileUrl: this.awsService.getS3SignedUrl(c.info.coverFileUri),
            },
          },
        };
      }),
      paginate: { limit, offset, count },
    };
  }

  public async getFolloweeList(
    params: GetMeExhibitsFollowParams | null
  ): Promise<Pagination<GetMeExhibitsFollowResponse>> {
    const limit = params?.limit ? Number(params.limit) : 20;
    const offset = params?.offset ? Number(params.offset) : 0;

    const [follow, count] = await this.followAccess.findAndCount({
      where: {
        followerId: this.cognitoUserId,
      },
      take: limit,
      skip: offset,
    });

    return {
      data: follow.map((v) => ({
        ...v,
        followee: {
          ...v.followee,
          avatarUrl: this.awsService.getS3SignedUrl(v.followee.avatar),
        },
      })),
      paginate: { limit, offset, count },
    };
  }
}
