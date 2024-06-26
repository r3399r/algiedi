import { SES } from 'aws-sdk';
import { inject, injectable } from 'inversify';
import { In } from 'typeorm';
import { ChatAccess } from 'src/access/ChatAccess';
import { DbAccess } from 'src/access/DbAccess';
import { ProjectUserAccess } from 'src/access/ProjectUserAccess';
import { UserAccess } from 'src/access/UserAccess';
import { Chat, WebsocketMessage, WsType } from 'src/model/api/Ws';
import { ChatEntity } from 'src/model/entity/ChatEntity';
import { AwsService } from './AwsService';

/**
 * Service class for Websocket
 */
@injectable()
export class WsService {
  @inject(SES)
  private readonly ses!: SES;

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

    return { a: WsType.Channel, d: {} };
  }

  public async receiveDisconnect(connectionId: string) {
    const user = await this.userAccess.findOneByConnectionIdOrFail(
      connectionId
    );
    user.connectionId = null;
    await this.userAccess.save(user);

    return { a: WsType.Channel, d: {} };
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
    const project = pu.length > 0 ? pu[0].project : undefined;
    const message: WebsocketMessage<Chat> = {
      a: WsType.Chat,
      d: {
        user: sender,
        project,
        content,
        createdAt: newChat.createdAt,
      },
    };

    await Promise.all(
      users.map(async (u) => {
        if (!u.connectionId) {
          if (
            u.lastSentAt === null ||
            new Date().getTime() - new Date(u.lastSentAt).getTime() >
              15 * 60 * 1000
          ) {
            await this.ses
              .sendEmail({
                Destination: {
                  ToAddresses: [u.email],
                },
                Message: {
                  Body: {
                    Text: {
                      Charset: 'UTF-8',
                      Data: `Hello ${u.username}, ${sender?.username} left you a message in regards to the project.\nProject: ${project?.info.name}\nhttps://dev.gotronmusic.com/project?id=${project?.id}`,
                    },
                  },
                  Subject: {
                    Charset: 'UTF-8',
                    Data: `You've recevied a message from ${sender?.username}`,
                  },
                },
                Source: 'GoTron@gotronmusic.com',
              })
              .promise();
            await this.userAccess.save({
              ...u,
              lastSentAt: new Date().toISOString(),
            });
          }
        } else await this.awsService.sendWsMessage(u.connectionId, message);
      })
    );

    return { a: WsType.Channel, d: {} };
  }

  public async receivePing(connectionId: string) {
    const message: WebsocketMessage<string> = {
      a: WsType.Ping,
      d: 'pong',
    };
    await this.awsService.sendWsMessage(connectionId, message);

    return { a: WsType.Ping, d: { data: 'pong' } };
  }

  public async receiveDefault() {
    // TODO
    return { a: WsType.Channel, d: {} };
  }
}
