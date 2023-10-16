import { inject, injectable } from 'inversify';
import { CommentAccess } from 'src/access/CommentAccess';
import { DbAccess } from 'src/access/DbAccess';
import { LikeAccess } from 'src/access/LikeAccess';
import { UserAccess } from 'src/access/UserAccess';
import { ViewCreationExploreAccess } from 'src/access/ViewCreationExploreAccess';
import { PostCreationIdCommentRequest } from 'src/model/api/Creation';
import { CommentEntity } from 'src/model/entity/CommentEntity';
import { LikeEntity } from 'src/model/entity/LikeEntity';
import { NotificationType } from 'src/model/entity/NotificationEntity';
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

  public async cleanup() {
    await this.dbAccess.cleanup();
  }

  public async likeCreation(id: string) {
    const likeEntity = new LikeEntity();
    likeEntity.userId = this.cognitoUserId;
    likeEntity.creationId = id;
    await this.likeAccess.save(likeEntity);

    const creation = await this.viewCreationExploreAccess.findOneByIdOrFail(id);
    if (creation.userId !== null) {
      const user = await this.userAccess.findOneByIdOrFail(creation.userId);

      // notify
      await this.notificationService.notify(NotificationType.Like, user, id);
    }
  }

  public async unlikeCreation(id: string) {
    const oldLike = await this.likeAccess.findOneOrFail({
      where: { userId: this.cognitoUserId, creationId: id },
    });
    await this.likeAccess.hardDeleteById(oldLike.id);
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
