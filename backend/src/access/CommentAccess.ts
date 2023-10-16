import { inject, injectable } from 'inversify';
import { FindManyOptions } from 'typeorm';
import { Comment, CommentEntity } from 'src/model/entity/CommentEntity';
import { Database } from 'src/util/Database';

/**
 * Access class for Comment model.
 */
@injectable()
export class CommentAccess {
  @inject(Database)
  private readonly database!: Database;

  public async find(options: FindManyOptions<Comment>) {
    const qr = await this.database.getQueryRunner();

    return await qr.manager.find<Comment>(CommentEntity.name, {
      relations: { user: true },
      ...options,
    });
  }

  public async save(data: Comment) {
    const qr = await this.database.getQueryRunner();
    const entity = new CommentEntity();
    Object.assign(entity, data);

    return await qr.manager.save(entity);
  }
}
