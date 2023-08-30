import { bindings } from 'src/bindings';
import { MeService } from 'src/logic/MeService';
import { PutMeRequest } from 'src/model/api/Me';
import { BadRequestError, InternalServerError } from 'src/model/error';
import { LambdaContext, LambdaEvent, LambdaOutput } from 'src/model/Lambda';
import { errorOutput, successOutput } from 'src/util/lambdaHelper';
import { LambdaSetup } from 'src/util/LambdaSetup';

export async function me(
  event: LambdaEvent,
  _context?: LambdaContext
): Promise<LambdaOutput> {
  let service: MeService | null = null;
  try {
    LambdaSetup.setup(event);
    service = bindings.get(MeService);

    let res: unknown;

    switch (event.resource) {
      case '/api/me':
        res = await apiMe(event, service);
        break;
      case '/api/me/social':
        res = await apiMeSocial(event, service);
        break;
      default:
        throw new InternalServerError('unknown resource');
    }

    return successOutput(res);
  } catch (e) {
    return errorOutput(e);
  }
}

async function apiMe(event: LambdaEvent, service: MeService) {
  if (event.headers === null)
    throw new BadRequestError('headers should not be empty');
  switch (event.httpMethod) {
    case 'GET':
      return service.getMe();
    case 'PUT':
      if (event.body === null)
        throw new BadRequestError('body should not be empty');

      return service.updateMe(JSON.parse(event.body) as PutMeRequest);
    default:
      throw new InternalServerError('unknown http method');
  }
}

async function apiMeSocial(event: LambdaEvent, service: MeService) {
  if (event.headers === null)
    throw new BadRequestError('headers should not be empty');
  switch (event.httpMethod) {
    case 'GET':
      return service.getMySocial();
    default:
      throw new InternalServerError('unknown http method');
  }
}
