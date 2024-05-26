import { inject, injectable } from 'inversify';
import { FindManyOptions, FindOneOptions } from 'typeorm';
import { Caption, CaptionEntity } from 'src/model/entity/CaptionEntity';
import { Database } from 'src/util/Database';

/**
 * Access class for Caption model.
 */
@injectable()
export class CaptionAccess {
  @inject(Database)
  private readonly database!: Database;

  public async findOne(options: FindOneOptions<Caption>) {
    const qr = await this.database.getQueryRunner();

    return await qr.manager.findOne<Caption>(CaptionEntity.name, options);
  }

  public async find(options?: FindManyOptions<Caption>) {
    const qr = await this.database.getQueryRunner();

    return await qr.manager.find<Caption>(CaptionEntity.name, options);
  }

  public async save(data: Caption) {
    const qr = await this.database.getQueryRunner();
    const entity = new CaptionEntity();
    Object.assign(entity, data);

    return await qr.manager.save(entity);
  }

  public async hardDeleteById(id: string) {
    const qr = await this.database.getQueryRunner();

    return await qr.manager.delete(CaptionEntity.name, { id });
  }
}
