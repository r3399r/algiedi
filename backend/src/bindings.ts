import 'reflect-metadata';
import { CognitoIdentityServiceProvider, Lambda, S3, SNS } from 'aws-sdk';
import { Container } from 'inversify';
import { DbAccess } from './access/DbAccess';
import { LyricsAccess } from './access/LyricsAccess';
import { ProjectAccess } from './access/ProjectAccess';
import { ProjectUserAccess } from './access/ProjectUserAccess';
import { TrackAccess } from './access/TrackAccess';
import { UserAccess } from './access/UserAccess';
import { ViewCreationAccess } from './access/ViewCreationAccess';
import { AwsService } from './logic/AwsService';
import { CognitoService } from './logic/CognitoService';
import { MeService } from './logic/MeService';
import { ProjectService } from './logic/ProjectService';
import { SnsService } from './logic/SnsService';
import { UploadService } from './logic/UploadService';
import { UserService } from './logic/UserService';
import { VpcService } from './logic/VpcService';
import { LyricsEntity } from './model/entity/LyricsEntity';
import { ProjectEntity } from './model/entity/ProjectEntity';
import { ProjectUserEntity } from './model/entity/ProjectUserEntity';
import { TrackEntity } from './model/entity/TrackEntity';
import { UserEntity } from './model/entity/UserEntity';
import { ViewCreationEntity } from './model/entity/ViewCreationEntity';
import { Database, dbEntitiesBindingId } from './util/Database';

const container: Container = new Container();

container.bind<Database>(Database).toSelf().inSingletonScope();

// bind repeatedly for db entities
container.bind<Function>(dbEntitiesBindingId).toFunction(LyricsEntity);
container.bind<Function>(dbEntitiesBindingId).toFunction(ProjectEntity);
container.bind<Function>(dbEntitiesBindingId).toFunction(ProjectUserEntity);
container.bind<Function>(dbEntitiesBindingId).toFunction(TrackEntity);
container.bind<Function>(dbEntitiesBindingId).toFunction(UserEntity);
container.bind<Function>(dbEntitiesBindingId).toFunction(ViewCreationEntity);

// db access for tables
container.bind<DbAccess>(DbAccess).toSelf();
container.bind<LyricsAccess>(LyricsAccess).toSelf();
container.bind<ProjectAccess>(ProjectAccess).toSelf();
container.bind<ProjectUserAccess>(ProjectUserAccess).toSelf();
container.bind<TrackAccess>(TrackAccess).toSelf();
container.bind<UserAccess>(UserAccess).toSelf();
container.bind<ViewCreationAccess>(ViewCreationAccess).toSelf();

// service
container.bind<AwsService>(AwsService).toSelf();
container.bind<CognitoService>(CognitoService).toSelf();
container.bind<ProjectService>(ProjectService).toSelf();
container.bind<SnsService>(SnsService).toSelf();
container.bind<UploadService>(UploadService).toSelf();
container.bind<UserService>(UserService).toSelf();
container.bind<VpcService>(VpcService).toSelf();
container.bind<MeService>(MeService).toSelf();

// AWS
container.bind<SNS>(SNS).toDynamicValue(() => new SNS());
container.bind<S3>(S3).toDynamicValue(() => new S3());
container.bind<Lambda>(Lambda).toDynamicValue(() => new Lambda());
container
  .bind<CognitoIdentityServiceProvider>(CognitoIdentityServiceProvider)
  .toDynamicValue(() => new CognitoIdentityServiceProvider());

export { container as bindings };
