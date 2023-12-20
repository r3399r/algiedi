import { inject, injectable } from 'inversify';
import { CommentAccess } from 'src/access/CommentAccess';
import { DbAccess } from 'src/access/DbAccess';
import { LikeAccess } from 'src/access/LikeAccess';
import { LyricsAccess } from 'src/access/LyricsAccess';
import { ProjectAccess } from 'src/access/ProjectAccess';
import { ProjectUserAccess } from 'src/access/ProjectUserAccess';
import { TrackAccess } from 'src/access/TrackAccess';
import { UserAccess } from 'src/access/UserAccess';
import { ViewCreationExploreAccess } from 'src/access/ViewCreationExploreAccess';
import { PostCreationIdCommentRequest } from 'src/model/api/Creation';
import { Type } from 'src/model/constant/Creation';
import { NotificationType } from 'src/model/constant/Notification';
import { CommentEntity } from 'src/model/entity/CommentEntity';
import { LikeEntity } from 'src/model/entity/LikeEntity';
import { User } from 'src/model/entity/UserEntity';
import { bn } from 'src/util/bignumber';
import { cognitoSymbol } from 'src/util/LambdaSetup';
import { NotificationService } from './NotificationService';

/**
 * Service class for Creation
 */
@injectable()
export class CreationService {
  @inject(cognitoSymbol)
  private readonly cognitoUserId!: string;

  @inject(DbAccess)
  private readonly dbAccess!: DbAccess;

  @inject(LikeAccess)
  private readonly likeAccess!: LikeAccess;

  @inject(CommentAccess)
  private readonly commentAccess!: CommentAccess;

  @inject(UserAccess)
  private readonly userAccess!: UserAccess;

  @inject(ViewCreationExploreAccess)
  private readonly viewCreationExploreAccess!: ViewCreationExploreAccess;

  @inject(NotificationService)
  private readonly notificationService!: NotificationService;

  @inject(LyricsAccess)
  private readonly lyricsAccess!: LyricsAccess;

  @inject(TrackAccess)
  private readonly trackAccess!: TrackAccess;

  @inject(ProjectAccess)
  private readonly projectAccess!: ProjectAccess;

  @inject(ProjectUserAccess)
  private readonly projectUserAccess!: ProjectUserAccess;

  public async cleanup() {
    await this.dbAccess.cleanup();
  }

  public async likeCreation(id: string) {
    const vc = await this.viewCreationExploreAccess.findOneByIdOrFail(id);

    const likeEntity = new LikeEntity();
    likeEntity.userId = this.cognitoUserId;
    likeEntity.creationId = id;
    likeEntity.type = vc.type;
    await this.likeAccess.save(likeEntity);

    const creation = await this.viewCreationExploreAccess.findOneByIdOrFail(id);
    if (creation.type === Type.Lyrics) {
      const lyrics = await this.lyricsAccess.findOneOrFailById(id);
      lyrics.countLike = bn(lyrics.countLike).plus(1).toString();
      await this.lyricsAccess.save(lyrics);
    } else if (creation.type === Type.Track) {
      const track = await this.trackAccess.findOneOrFailById(id);
      track.countLike = bn(track.countLike).plus(1).toString();
      await this.trackAccess.save(track);
    } else if (creation.type === Type.Song) {
      const project = await this.projectAccess.findOneOrFailById(id);
      project.countLike = bn(project.countLike).plus(1).toString();
      await this.projectAccess.save(project);
    }

    // find authors
    const users: User[] = [];
    if (creation.user !== null) users.push(creation.user);
    else if (creation.projectId) {
      const pu = await this.projectUserAccess.findByProjectId(
        creation.projectId
      );
      pu.forEach((v) => users.push(v.user));
    }

    // notify
    for (const u of users)
      await this.notificationService.notify(NotificationType.Like, u, id);
  }

  public async unlikeCreation(id: string) {
    const oldLike = await this.likeAccess.findOneOrFail({
      where: { userId: this.cognitoUserId, creationId: id },
    });
    await this.likeAccess.hardDeleteById(oldLike.id);

    const creation = await this.viewCreationExploreAccess.findOneByIdOrFail(id);
    const count = await this.likeAccess.count({
      where: {
        creationId: id,
      },
    });
    if (creation.type === Type.Lyrics) {
      const lyrics = await this.lyricsAccess.findOneOrFailById(id);
      lyrics.countLike = String(count);
      await this.lyricsAccess.save(lyrics);
    } else if (creation.type === Type.Track) {
      const track = await this.trackAccess.findOneOrFailById(id);
      track.countLike = String(count);
      await this.trackAccess.save(track);
    } else if (creation.type === Type.Song) {
      const project = await this.projectAccess.findOneOrFailById(id);
      project.countLike = String(count);
      await this.projectAccess.save(project);
    }
  }

  public async commentCreation(id: string, data: PostCreationIdCommentRequest) {
    const commentEntity = new CommentEntity();
    commentEntity.userId = this.cognitoUserId;
    commentEntity.creationId = id;
    commentEntity.comment = data.comment;
    await this.commentAccess.save(commentEntity);

    const creation = await this.viewCreationExploreAccess.findOneByIdOrFail(id);
    if (creation.userId !== null) {
      const user = await this.userAccess.findOneByIdOrFail(creation.userId);

      // notify
      await this.notificationService.notify(NotificationType.Comment, user, id);
    }
  }
}
