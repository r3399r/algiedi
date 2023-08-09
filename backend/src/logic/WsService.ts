import { ApiGatewayManagementApi } from 'aws-sdk';
import { inject, injectable } from 'inversify';
import { In } from 'typeorm';
import { ChatAccess } from 'src/access/ChatAccess';
import { DbAccess } from 'src/access/DbAccess';
import { ProjectUserAccess } from 'src/access/ProjectUserAccess';
import { UserAccess } from 'src/access/UserAccess';
import { Chat, WebsocketResponse } from 'src/model/api/Ws';
import { ChatEntity } from 'src/model/entity/ChatEntity';
import { AwsService } from './AwsService';

/**
 * Service class for Websocket
 */
@injectable()
export class WsService {
  @inject(ApiGatewayManagementApi)
  private readonly apiGatewayManagementApi!: ApiGatewayManagementApi;

  @inject(DbAccess)
  private readonly dbAccess!: DbAccess;

  @inject(UserAccess)
  private readonly userAccess!: UserAccess;

  @inject(ChatAccess)
  private readonly chatAccess!: ChatAccess;

  @inject(ProjectUserAccess)
  private readonly projectUserAccess!: ProjectUserAccess;

  @inject(AwsService)
  private readonly awsService!: AwsService;

  public async cleanup() {
    await this.dbAccess.cleanup();
  }

  public async receiveConnect(userId: string, connectionId: string) {
    const user = await this.userAccess.findOneByIdOrFail(userId);
    user.connectionId = connectionId;
    await this.userAccess.save(user);

    return { a: 'channel', d: {} };
  }

  public async receiveDisconnect(connectionId: string) {
    const user = await this.userAccess.findOneByConnectionIdOrFail(
      connectionId
    );
    user.connectionId = null;
    await this.userAccess.save(user);

    return { a: 'channel', d: {} };
  }

  public async receiveChat(body: any) {
    const userId = body.userId as string;
    const projectId = body.projectId as string;
    const content = body.content as string;
    const chat = new ChatEntity();
    chat.userId = userId;
    chat.projectId = projectId;
    chat.content = content;
    const newChat = await this.chatAccess.save(chat);

    const pu = await this.projectUserAccess.findByProjectId(projectId);
    const users = await this.userAccess.find({
      where: { id: In(pu.map((p) => p.userId)) },
    });
    const sender = users.find((v) => v.id === userId);
    const message: WebsocketResponse<Chat> = {
      a: 'chat',
      d: {
        user: sender
          ? {
              ...sender,
              avatarUrl: this.awsService.getS3SignedUrl(sender.avatar),
            }
          : undefined,
        content,
        createdAt: newChat.createdAt,
      },
    };

    await Promise.all(
      users.map(async (u) => {
        if (!u.connectionId) return;
        await this.apiGatewayManagementApi
          .postToConnection({
            ConnectionId: u.connectionId,
            Data: JSON.stringify(message),
          })
          .promise();
      })
    );

    return { a: 'channel', d: {} };
  }

  public async receiveDefault() {
    // TODO
    return { a: 'channel', d: {} };
  }
}
