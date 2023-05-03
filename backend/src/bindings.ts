import 'reflect-metadata';
import { SNS } from 'aws-sdk';
import { Container } from 'inversify';
import { DbAccess } from './access/DbAccess';
import { ProjectAccess } from './access/ProjectAccess';
import { SnsService } from './logic/SnsService';
import { VariableService } from './logic/VariableService';
import { ProjectEntity } from './model/entity/ProjectEntity';
import { Database, dbEntitiesBindingId } from './util/Database';

const container: Container = new Container();

container.bind<Database>(Database).toSelf().inSingletonScope();

// bind repeatedly for db entities
container.bind<Function>(dbEntitiesBindingId).toFunction(ProjectEntity);

// db access for tables
container.bind<DbAccess>(DbAccess).toSelf();
container.bind<ProjectAccess>(ProjectAccess).toSelf();

// service
container.bind<SnsService>(SnsService).toSelf();
container.bind<VariableService>(VariableService).toSelf();

// AWS
container.bind<SNS>(SNS).toDynamicValue(() => new SNS());

export { container as bindings };
