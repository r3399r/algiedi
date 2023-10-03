import { inject, injectable } from 'inversify';
import { FindManyOptions } from 'typeorm';
import {
  Notification,
  NotificationEntity,
} from 'src/model/entity/NotificationEntity';
import { Database } from 'src/util/Database';

/**
 * Access class for Notification model.
 */
@injectable()
export class NotificationAccess {
  @inject(Database)
  private readonly database!: Database;

  public async find(options: FindManyOptions<Notification>) {
    const qr = await this.database.getQueryRunner();

    return await qr.manager.find<Notification>(NotificationEntity.name, {
      relations: { toUser: true, fromUser: true, project: true },
      ...options,
    });
  }

  public async findOneByIdOrFail(id: string) {
    const qr = await this.database.getQueryRunner();

    return await qr.manager.findOneOrFail<Notification>(
      NotificationEntity.name,
      { where: { id } }
    );
  }

  public async findByUserId(userId: string) {
    return await this.find({
      where: { toUserId: userId },
      order: { createdAt: 'DESC' },
    });
  }

  public async save(data: Notification) {
    const qr = await this.database.getQueryRunner();
    const entity = new NotificationEntity();
    Object.assign(entity, data);

    return await qr.manager.save(entity);
  }
}
