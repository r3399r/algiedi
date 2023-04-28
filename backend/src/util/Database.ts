import 'reflect-metadata';
import 'pg';
import { injectable, multiInject } from 'inversify';
import { DataSource, QueryRunner } from 'typeorm';

export const dbEntitiesBindingId = Symbol('DbEntities');
/**
 * Database manager class
 */
@injectable()
export class Database {
  private dataSource: DataSource | undefined = undefined;
  private queryRunner: QueryRunner | undefined = undefined;

  @multiInject(dbEntitiesBindingId)
  private readonly entities!: Function[];

  private async getDataSource() {
    if (this.dataSource === undefined)
      this.dataSource = new DataSource({
        type: 'mysql',
        host: 'gotron-test-free.chuqajt3pq1h.ap-southeast-1.rds.amazonaws.com',
        port: 3306,
        username: 'admin',
        password: 'tNk5wF8ON4U3Y5BWJpr0',
        database: 'gotron',
        // ssl: true,
        entities: this.entities,
        synchronize: false,
        logging: false,
      });
    if (!this.dataSource.isInitialized) await this.dataSource.initialize();

    return this.dataSource;
  }

  public async getQueryRunner() {
    if (this.queryRunner === undefined || this.queryRunner.isReleased) {
      const ds = await this.getDataSource();
      this.queryRunner = ds.createQueryRunner();
      await this.queryRunner.connect();
    }

    return this.queryRunner;
  }

  public async cleanUp() {
    if (this.queryRunner !== undefined && !this.queryRunner.isReleased)
      await this.queryRunner.release();
    if (this.dataSource !== undefined && !this.dataSource.isInitialized)
      await this.dataSource.destroy();
  }
}
