import 'reflect-metadata';
import { S3, SNS } from 'aws-sdk';
import { Container } from 'inversify';
import { DbAccess } from './access/DbAccess';
import { LyricsAccess } from './access/LyricsAccess';
import { ProjectAccess } from './access/ProjectAccess';
import { ProjectUserAccess } from './access/ProjectUserAccess';
import { TrackAccess } from './access/TrackAccess';
import { UserAccess } from './access/UserAccess';
import { ViewLyricsAccess } from './access/ViewLyricsAccess';
import { ViewProjectUserAccess } from './access/ViewProjectUserAccess';
import { ViewTrackAccess } from './access/ViewTrackAccess';
import { CognitoService } from './logic/CognitoService';
import { ProjectService } from './logic/ProjectService';
import { SnsService } from './logic/SnsService';
import { UploadService } from './logic/UploadService';
import { VariableService } from './logic/VariableService';
import { LyricsEntity } from './model/entity/LyricsEntity';
import { ProjectEntity } from './model/entity/ProjectEntity';
import { ProjectUserEntity } from './model/entity/ProjectUserEntity';
import { TrackEntity } from './model/entity/TrackEntity';
import { UserEntity } from './model/entity/UserEntity';
import { ViewLyricsEntity } from './model/entity/ViewLyricsEntity';
import { ViewProjectUserEntity } from './model/entity/ViewProjectUserEntity';
import { ViewTrackEntity } from './model/entity/ViewTrackEntity';
import { Database, dbEntitiesBindingId } from './util/Database';

const container: Container = new Container();

container.bind<Database>(Database).toSelf().inSingletonScope();

// bind repeatedly for db entities
container.bind<Function>(dbEntitiesBindingId).toFunction(LyricsEntity);
container.bind<Function>(dbEntitiesBindingId).toFunction(ProjectEntity);
container.bind<Function>(dbEntitiesBindingId).toFunction(ProjectUserEntity);
container.bind<Function>(dbEntitiesBindingId).toFunction(TrackEntity);
container.bind<Function>(dbEntitiesBindingId).toFunction(UserEntity);
container.bind<Function>(dbEntitiesBindingId).toFunction(ViewLyricsEntity);
container.bind<Function>(dbEntitiesBindingId).toFunction(ViewProjectUserEntity);
container.bind<Function>(dbEntitiesBindingId).toFunction(ViewTrackEntity);

// db access for tables
container.bind<DbAccess>(DbAccess).toSelf();
container.bind<LyricsAccess>(LyricsAccess).toSelf();
container.bind<ProjectAccess>(ProjectAccess).toSelf();
container.bind<ProjectUserAccess>(ProjectUserAccess).toSelf();
container.bind<TrackAccess>(TrackAccess).toSelf();
container.bind<UserAccess>(UserAccess).toSelf();
container.bind<ViewLyricsAccess>(ViewLyricsAccess).toSelf();
container.bind<ViewProjectUserAccess>(ViewProjectUserAccess).toSelf();
container.bind<ViewTrackAccess>(ViewTrackAccess).toSelf();

// service
container.bind<CognitoService>(CognitoService).toSelf();
container.bind<ProjectService>(ProjectService).toSelf();
container.bind<SnsService>(SnsService).toSelf();
container.bind<UploadService>(UploadService).toSelf();
container.bind<VariableService>(VariableService).toSelf();

// AWS
container.bind<SNS>(SNS).toDynamicValue(() => new SNS());
container.bind<S3>(S3).toDynamicValue(() => new S3());

export { container as bindings };
