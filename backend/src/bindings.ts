import 'reflect-metadata';
import {
  ApiGatewayManagementApi,
  CognitoIdentityServiceProvider,
  Lambda,
  S3,
  SNS,
} from 'aws-sdk';
import { Container } from 'inversify';
import { ChatAccess } from './access/ChatAccess';
import { CommentAccess } from './access/CommentAccess';
import { DbAccess } from './access/DbAccess';
import { FollowAccess } from './access/FollowAccess';
import { InfoAccess } from './access/InfoAccess';
import { LikeAccess } from './access/LikeAccess';
import { LyricsAccess } from './access/LyricsAccess';
import { LyricsHistoryAccess } from './access/LyricsHistoryAccess';
import { ProjectAccess } from './access/ProjectAccess';
import { ProjectHistoryAccess } from './access/ProjectHistoryAccess';
import { ProjectUserAccess } from './access/ProjectUserAccess';
import { SongAccess } from './access/SongAccess';
import { TrackAccess } from './access/TrackAccess';
import { TrackHistoryAccess } from './access/TrackHistoryAccess';
import { UserAccess } from './access/UserAccess';
import { ViewCreationAccess } from './access/ViewCreationAccess';
import { ViewCreationExploreAccess } from './access/ViewCreationExploreAccess';
import { AwsService } from './logic/AwsService';
import { CognitoService } from './logic/CognitoService';
import { CreationService } from './logic/CreationService';
import { ExploreService } from './logic/ExploreService';
import { MeService } from './logic/MeService';
import { ProjectService } from './logic/ProjectService';
import { SnsService } from './logic/SnsService';
import { UploadService } from './logic/UploadService';
import { UserService } from './logic/UserService';
import { VpcService } from './logic/VpcService';
import { WsService } from './logic/WsService';
import { ChatEntity } from './model/entity/ChatEntity';
import { CommentEntity } from './model/entity/CommentEntity';
import { FollowEntity } from './model/entity/FollowEntity';
import { InfoEntity } from './model/entity/InfoEntity';
import { LikeEntity } from './model/entity/LikeEntity';
import { LyricsEntity } from './model/entity/LyricsEntity';
import { LyricsHistoryEntity } from './model/entity/LyricsHistoryEntity';
import { ProjectEntity } from './model/entity/ProjectEntity';
import { ProjectHistoryEntity } from './model/entity/ProjectHistoryEntity';
import { ProjectUserEntity } from './model/entity/ProjectUserEntity';
import { SongEntity } from './model/entity/SongEntity';
import { TrackEntity } from './model/entity/TrackEntity';
import { TrackHistoryEntity } from './model/entity/TrackHistoryEntity';
import { UserEntity } from './model/entity/UserEntity';
import { ViewCreationEntity } from './model/entity/ViewCreationEntity';
import { ViewCreationExploreEntity } from './model/entity/ViewCreationExploreEntity';
import { Database, dbEntitiesBindingId } from './util/Database';

const container: Container = new Container();

container.bind<Database>(Database).toSelf().inSingletonScope();

// bind repeatedly for db entities
container.bind<Function>(dbEntitiesBindingId).toFunction(ChatEntity);
container.bind<Function>(dbEntitiesBindingId).toFunction(InfoEntity);
container.bind<Function>(dbEntitiesBindingId).toFunction(LyricsEntity);
container.bind<Function>(dbEntitiesBindingId).toFunction(LyricsHistoryEntity);
container.bind<Function>(dbEntitiesBindingId).toFunction(ProjectEntity);
container.bind<Function>(dbEntitiesBindingId).toFunction(ProjectUserEntity);
container.bind<Function>(dbEntitiesBindingId).toFunction(ProjectHistoryEntity);
container.bind<Function>(dbEntitiesBindingId).toFunction(SongEntity);
container.bind<Function>(dbEntitiesBindingId).toFunction(TrackEntity);
container.bind<Function>(dbEntitiesBindingId).toFunction(TrackHistoryEntity);
container.bind<Function>(dbEntitiesBindingId).toFunction(UserEntity);
container.bind<Function>(dbEntitiesBindingId).toFunction(LikeEntity);
container.bind<Function>(dbEntitiesBindingId).toFunction(CommentEntity);
container.bind<Function>(dbEntitiesBindingId).toFunction(FollowEntity);
container.bind<Function>(dbEntitiesBindingId).toFunction(ViewCreationEntity);
container
  .bind<Function>(dbEntitiesBindingId)
  .toFunction(ViewCreationExploreEntity);

// db access for tables
container.bind<DbAccess>(DbAccess).toSelf();
container.bind<ChatAccess>(ChatAccess).toSelf();
container.bind<InfoAccess>(InfoAccess).toSelf();
container.bind<LyricsAccess>(LyricsAccess).toSelf();
container.bind<LyricsHistoryAccess>(LyricsHistoryAccess).toSelf();
container.bind<ProjectAccess>(ProjectAccess).toSelf();
container.bind<ProjectUserAccess>(ProjectUserAccess).toSelf();
container.bind<ProjectHistoryAccess>(ProjectHistoryAccess).toSelf();
container.bind<SongAccess>(SongAccess).toSelf();
container.bind<TrackAccess>(TrackAccess).toSelf();
container.bind<TrackHistoryAccess>(TrackHistoryAccess).toSelf();
container.bind<UserAccess>(UserAccess).toSelf();
container.bind<ViewCreationAccess>(ViewCreationAccess).toSelf();
container.bind<ViewCreationExploreAccess>(ViewCreationExploreAccess).toSelf();
container.bind<LikeAccess>(LikeAccess).toSelf();
container.bind<CommentAccess>(CommentAccess).toSelf();
container.bind<FollowAccess>(FollowAccess).toSelf();

// service
container.bind<AwsService>(AwsService).toSelf();
container.bind<CognitoService>(CognitoService).toSelf();
container.bind<ExploreService>(ExploreService).toSelf();
container.bind<ProjectService>(ProjectService).toSelf();
container.bind<SnsService>(SnsService).toSelf();
container.bind<UploadService>(UploadService).toSelf();
container.bind<UserService>(UserService).toSelf();
container.bind<VpcService>(VpcService).toSelf();
container.bind<MeService>(MeService).toSelf();
container.bind<CreationService>(CreationService).toSelf();
container.bind<WsService>(WsService).toSelf();

// AWS
container.bind<SNS>(SNS).toDynamicValue(() => new SNS());
container.bind<S3>(S3).toDynamicValue(() => new S3());
container.bind<Lambda>(Lambda).toDynamicValue(() => new Lambda());
container.bind<ApiGatewayManagementApi>(ApiGatewayManagementApi).toDynamicValue(
  () =>
    new ApiGatewayManagementApi({
      endpoint: process.env.WS_ENDPOINT,
    })
);
container
  .bind<CognitoIdentityServiceProvider>(CognitoIdentityServiceProvider)
  .toDynamicValue(() => new CognitoIdentityServiceProvider());

export { container as bindings };
