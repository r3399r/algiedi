import { inject, injectable } from 'inversify';
import { FindManyOptions } from 'typeorm';
import { Chat, ChatEntity } from 'src/model/entity/ChatEntity';
import { Database } from 'src/util/Database';

/**
 * Access class for Chat model.
 */
@injectable()
export class ChatAccess {
  @inject(Database)
  private readonly database!: Database;

  public async find(options: FindManyOptions<Chat>) {
    const qr = await this.database.getQueryRunner();

    return await qr.manager.find<Chat>(ChatEntity.name, {
      relations: { user: true, project: true },
      ...options,
    });
  }

  public async save(data: Chat) {
    const qr = await this.database.getQueryRunner();
    const entity = new ChatEntity();
    Object.assign(entity, data);

    return await qr.manager.save(entity);
  }

  public async hardDeleteByProjectId(id: string) {
    const qr = await this.database.getQueryRunner();

    await qr.manager.delete(ChatEntity.name, { projectId: id });
  }
}
