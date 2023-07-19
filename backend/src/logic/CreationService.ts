import { inject, injectable } from 'inversify';
import { CommentAccess } from 'src/access/CommentAccess';
import { DbAccess } from 'src/access/DbAccess';
import { LikeAccess } from 'src/access/LikeAccess';
import { PostCreationIdCommentRequest } from 'src/model/api/Creation';
import { CommentEntity } from 'src/model/entity/CommentEntity';
import { LikeEntity } from 'src/model/entity/LikeEntity';
import { cognitoSymbol } from 'src/util/LambdaSetup';

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

  public async cleanup() {
    await this.dbAccess.cleanup();
  }

  public async likeCreation(id: string) {
    const likeEntity = new LikeEntity();
    likeEntity.userId = this.cognitoUserId;
    likeEntity.creationId = id;
    await this.likeAccess.save(likeEntity);
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
  }
}
