import { ApiGatewayManagementApi } from 'aws-sdk';
import { inject, injectable } from 'inversify';
import { In } from 'typeorm';
import { ChatAccess } from 'src/access/ChatAccess';
import { DbAccess } from 'src/access/DbAccess';
import { ProjectUserAccess } from 'src/access/ProjectUserAccess';
import { UserAccess } from 'src/access/UserAccess';
import { ChatEntity } from 'src/model/entity/ChatEntity';

/**
 * Service class for Websocket
 */
@injectable()
export class WsService {
  // @inject(ApiGatewayManagementApi)
  // private readonly apiGatewayManagementApi!: ApiGatewayManagementApi;

  @inject(DbAccess)
  private readonly dbAccess!: DbAccess;

  @inject(UserAccess)
  private readonly userAccess!: UserAccess;

  @inject(ChatAccess)
  private readonly chatAccess!: ChatAccess;

  @inject(ProjectUserAccess)
  private readonly projectUserAccess!: ProjectUserAccess;

  public async cleanup() {
    await this.dbAccess.cleanup();
  }

  public async receiveConnect(userId: string, connectionId: string) {
    const user = await this.userAccess.findOneByIdOrFail(userId);
    user.connectionId = connectionId;
    await this.userAccess.save(user);
  }

  public async receiveDisconnect(connectionId: string) {
    const user = await this.userAccess.findOneByConnectionIdOrFail(
      connectionId
    );
    user.connectionId = null;
    await this.userAccess.save(user);
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

    const client = new ApiGatewayManagementApi({
      endpoint: '0nnwr8j4y2.execute-api.ap-southeast-1.amazonaws.com/ws',
    });

    const pu = await this.projectUserAccess.findByProjectId(projectId);
    const users = await this.userAccess.find({
      where: { id: In(pu.map((p) => p.userId)) },
    });
    await Promise.all(
      users.map(async (u) => {
        if (!u.connectionId) return;
        await client
          .postToConnection({
            ConnectionId: u.connectionId,
            Data: JSON.stringify({
              username: u.username,
              content,
              createdAt: newChat.createdAt,
            }),
          })
          .promise();
      })
    );
  }

  public async receiveDefault() {
    // TODO
  }
}
