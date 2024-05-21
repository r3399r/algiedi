import { inject, injectable } from 'inversify';
import { FindManyOptions, FindOneOptions } from 'typeorm';
import {
  ViewCreation,
  ViewCreationEntity,
} from 'src/model/entity/ViewCreationEntity';
import { Database } from 'src/util/Database';

/**
 * Access class for ViewCreation model.
 */
@injectable()
export class ViewCreationAccess {
  @inject(Database)
  private readonly database!: Database;

  public async find(options: FindManyOptions<ViewCreation>) {
    const qr = await this.database.getQueryRunner();

    return await qr.manager.find<ViewCreation>(ViewCreationEntity.name, {
      relations: { info: { caption: true }, project: true, user: true },
      ...options,
    });
  }

  public async findOne(options: FindOneOptions<ViewCreation>) {
    const qr = await this.database.getQueryRunner();

    return await qr.manager.findOne<ViewCreation>(ViewCreationEntity.name, {
      relations: { info: { caption: true }, project: true, user: true },
      ...options,
    });
  }

  public async findOneOrFail(options: FindOneOptions<ViewCreation>) {
    const qr = await this.database.getQueryRunner();

    return await qr.manager.findOneOrFail<ViewCreation>(
      ViewCreationEntity.name,
      {
        relations: { info: { caption: true }, project: true, user: true },
        ...options,
      }
    );
  }

  public async findOneById(id: string) {
    return await this.findOne({
      where: { id },
    });
  }

  public async findOneByIdOrFail(id: string) {
    return this.findOneOrFail({
      where: { id },
    });
  }
}
