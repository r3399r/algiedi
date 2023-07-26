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

    return await qr.manager.find<Chat>(ChatEntity.name, options);
  }

  public async findOneOrFailById(id: string) {
    const qr = await this.database.getQueryRunner();

    return await qr.manager.findOneOrFail<Chat>(ChatEntity.name, {
      where: { id },
    });
  }

  public async save(data: Chat) {
    const qr = await this.database.getQueryRunner();
    const entity = new ChatEntity();
    Object.assign(entity, data);

    return await qr.manager.save(entity);
  }
}
