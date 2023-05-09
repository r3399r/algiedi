import 'reflect-metadata';
import { S3, SNS } from 'aws-sdk';
import { Container } from 'inversify';
import { DbAccess } from './access/DbAccess';
import { LyricsAccess } from './access/LyricsAccess';
import { ProjectAccess } from './access/ProjectAccess';
import { TrackAccess } from './access/TrackAccess';
import { ProjectService } from './logic/ProjectService';
import { SnsService } from './logic/SnsService';
import { UploadService } from './logic/UploadService';
import { VariableService } from './logic/VariableService';
import { LyricsEntity } from './model/entity/LyricsEntity';
import { ProjectEntity } from './model/entity/ProjectEntity';
import { TrackEntity } from './model/entity/TrackEntity';
import { Database, dbEntitiesBindingId } from './util/Database';

const container: Container = new Container();

container.bind<Database>(Database).toSelf().inSingletonScope();

// bind repeatedly for db entities
container.bind<Function>(dbEntitiesBindingId).toFunction(LyricsEntity);
container.bind<Function>(dbEntitiesBindingId).toFunction(ProjectEntity);
container.bind<Function>(dbEntitiesBindingId).toFunction(TrackEntity);

// db access for tables
container.bind<DbAccess>(DbAccess).toSelf();
container.bind<LyricsAccess>(LyricsAccess).toSelf();
container.bind<ProjectAccess>(ProjectAccess).toSelf();
container.bind<TrackAccess>(TrackAccess).toSelf();

// service
container.bind<ProjectService>(ProjectService).toSelf();
container.bind<SnsService>(SnsService).toSelf();
container.bind<UploadService>(UploadService).toSelf();
container.bind<VariableService>(VariableService).toSelf();

// AWS
container.bind<SNS>(SNS).toDynamicValue(() => new SNS());
container.bind<S3>(S3).toDynamicValue(() => new S3());

export { container as bindings };
