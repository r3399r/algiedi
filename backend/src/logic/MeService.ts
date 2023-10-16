import { inject, injectable } from 'inversify';
import { In } from 'typeorm';
import { DbAccess } from 'src/access/DbAccess';
// import { FollowAccess } from 'src/access/FollowAccess';
import { LikeAccess } from 'src/access/LikeAccess';
import { UserAccess } from 'src/access/UserAccess';
import { ViewCreationExploreAccess } from 'src/access/ViewCreationExploreAccess';
import {
  GetMeResponse,
  // GetMeSocialResponse,
  PutMeRequest,
  PutMeResponse,
} from 'src/model/api/Me';
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

  @inject(LikeAccess)
  private readonly likeAccess!: LikeAccess;

  // @inject(FollowAccess)
  // private readonly followAccess!: FollowAccess;

  @inject(AwsService)
  private readonly awsService!: AwsService;

  @inject(ViewCreationExploreAccess)
  private readonly viewCreationExploreAccess!: ViewCreationExploreAccess;

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
    user.age = Number(data.age) ?? user.age;
    user.tag = data.tag ?? user.tag;
    user.facebook = data.facebook ?? user.facebook;
    user.instagram = data.instagram ?? user.instagram;
    user.youtube = data.youtube ?? user.youtube;
    user.soundcloud = data.soundcloud ?? user.soundcloud;
    await this.userAccess.save(user);

    return { ...user, avatarUrl: this.awsService.getS3SignedUrl(user.avatar) };
  }

  public async getMySocial(): Promise<any> {
    const likes = await this.likeAccess.find({
      where: { userId: this.cognitoUserId },
    });
    //   const follows = await this.followAccess.find({
    //     where: { followerId: this.cognitoUserId },
    //   });
    const creation = await this.viewCreationExploreAccess.find({
      where: { id: In(likes.map((v) => v.creationId)) },
    });
    console.log(creation);
    //   const followee = await this.userAccess.find({
    //     where: { id: In(follows.map((v) => v.followeeId)) },
    //   });

    //   return {
    //     creation: creation.map((v) => ({
    //       ...v,
    //       fileUrl: this.awsService.getS3SignedUrl(v.fileUri),
    //       tabFileUrl: this.awsService.getS3SignedUrl(v.tabFileUri),
    //       coverFileUrl: this.awsService.getS3SignedUrl(v.coverFileUri),
    //     })),
    //     followee: followee.map((v) => ({
    //       ...v,
    //       avatarUrl: this.awsService.getS3SignedUrl(v.avatar),
    //     })),
    //   };
  }
}
