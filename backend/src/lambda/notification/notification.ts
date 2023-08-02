import { bindings } from 'src/bindings';
import { NotificationService } from 'src/logic/NotificationService';
import { BadRequestError, InternalServerError } from 'src/model/error';
import { LambdaContext, LambdaEvent, LambdaOutput } from 'src/model/Lambda';
import { errorOutput, successOutput } from 'src/util/lambdaHelper';
import { LambdaSetup } from 'src/util/LambdaSetup';

export async function notification(
  event: LambdaEvent,
  _context?: LambdaContext
): Promise<LambdaOutput> {
  let service: NotificationService | null = null;
  try {
    LambdaSetup.setup(event);
    service = bindings.get(NotificationService);

    let res: unknown;

    switch (event.resource) {
      case '/api/notification':
        res = await apiNotification(event, service);
        break;
      case '/api/notification/{id}/read':
        res = await apiNotificationIdRead(event, service);
        break;
      default:
        throw new InternalServerError('unknown resource');
    }

    return successOutput(res);
  } catch (e) {
    return errorOutput(e);
  } finally {
    await service?.cleanup();
  }
}

async function apiNotification(
  event: LambdaEvent,
  service: NotificationService
) {
  if (event.headers === null)
    throw new BadRequestError('headers should not be empty');
  switch (event.httpMethod) {
    case 'GET':
      return service.getNotifications();
    default:
      throw new InternalServerError('unknown http method');
  }
}

async function apiNotificationIdRead(
  event: LambdaEvent,
  service: NotificationService
) {
  if (event.pathParameters === null)
    throw new BadRequestError('pathParameters should not be empty');
  if (event.headers === null)
    throw new BadRequestError('headers should not be empty');
  switch (event.httpMethod) {
    case 'PATCH':
      return service.setNotificationAsRead(event.pathParameters.id);
    default:
      throw new InternalServerError('unknown http method');
  }
}
