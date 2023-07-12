import { inject, injectable } from 'inversify';
import { FindManyOptions } from 'typeorm';
import { Info, InfoEntity } from 'src/model/entity/InfoEntity';
import { Database } from 'src/util/Database';

/**
 * Access class for Info model.
 */
@injectable()
export class InfoAccess {
  @inject(Database)
  private readonly database!: Database;

  public async find(options: FindManyOptions<Info>) {
    const qr = await this.database.getQueryRunner();

    return await qr.manager.find<Info>(InfoEntity.name, options);
  }

  public async findOneOrFailById(id: string) {
    const qr = await this.database.getQueryRunner();

    return await qr.manager.findOneOrFail<Info>(InfoEntity.name, {
      where: { id },
    });
  }

  public async save(data: Info) {
    const qr = await this.database.getQueryRunner();
    const entity = new InfoEntity();
    Object.assign(entity, data);

    return await qr.manager.save(entity);
  }
}
