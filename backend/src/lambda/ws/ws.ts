import { bindings } from 'src/bindings';
import { WsService } from 'src/logic/WsService';
import { WebsocketResponse } from 'src/model/api/Ws';
import { LambdaContext } from 'src/model/Lambda';

export async function ws(event: any, _context?: LambdaContext): Promise<any> {
  let service: WsService | null = null;
  try {
    service = bindings.get(WsService);
    console.log(event);
    const routeKey = event.requestContext.routeKey as string;
    const connectionId = event.requestContext.connectionId as string;
    const userId = event.queryStringParameters?.userId as string;

    let res: WebsocketResponse;

    switch (routeKey) {
      case '$connect':
        res = await service.receiveConnect(userId, connectionId);
        break;
      case '$disconnect':
        res = await service.receiveDisconnect(connectionId);
        break;
      case '$default':
        res = await service.receiveDefault();
        break;
      case 'chat':
        res = await service.receiveChat(JSON.parse(event.body));
        break;
      default:
        throw new Error(`Unknown routeKey: ${routeKey}`);
    }

    return {
      statusCode: 200,
      body: JSON.stringify(res),
    };
  } catch (e) {
    console.log(e);

    return {
      statusCode: 500,
      body: JSON.stringify(e),
    };
  } finally {
    await service?.cleanup();
  }
}
