import { bindings } from 'src/bindings';
import { WsService } from 'src/logic/WsService';
import { LambdaContext } from 'src/model/Lambda';

export async function ws(event: any, _context?: LambdaContext): Promise<any> {
  let service: WsService | null = null;
  try {
    service = bindings.get(WsService);
    console.log(event);
    const routeKey = event.requestContext.routeKey as string;
    const connectionId = event.requestContext.connectionId as string;
    const userId = event.queryStringParameters?.userId as string;
    console.log(routeKey, connectionId);

    switch (routeKey) {
      case '$connect':
        await service.receiveConnect(userId, connectionId);
        break;
      case '$disconnect':
        await service.receiveDisconnect(connectionId);
        break;
      case '$default':
        await service.receiveDefault();
        break;
      case 'chat':
        await service.receiveChat(JSON.parse(event.body));
        break;
    }

    return { statusCode: 200 };
  } catch (e) {
    console.log(e);

    return { statusCode: 500 };
  } finally {
    await service?.cleanup();
  }
}
