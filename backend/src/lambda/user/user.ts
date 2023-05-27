import { bindings } from 'src/bindings';
import { UserService } from 'src/logic/UserService';
import { PatchUserRequest } from 'src/model/api/User';
import { BadRequestError, InternalServerError } from 'src/model/error';
import { LambdaContext, LambdaEvent, LambdaOutput } from 'src/model/Lambda';
import { errorOutput, successOutput } from 'src/util/lambdaHelper';
import { LambdaSetup } from 'src/util/LambdaSetup';

export async function user(
  event: LambdaEvent,
  _context?: LambdaContext
): Promise<LambdaOutput> {
  let service: UserService | null = null;
  try {
    LambdaSetup.setup(event);
    service = bindings.get(UserService);

    let res: unknown;

    switch (event.resource) {
      case '/api/user':
        res = await apiUser(event, service);
        break;
      default:
        throw new InternalServerError('unknown resource');
    }

    return successOutput(res);
  } catch (e) {
    return errorOutput(e);
  }
}

async function apiUser(event: LambdaEvent, service: UserService) {
  if (event.headers === null)
    throw new BadRequestError('headers should not be empty');
  switch (event.httpMethod) {
    case 'PUT':
      if (event.body === null)
        throw new BadRequestError('body should not be empty');

      return service.initUser(JSON.parse(event.body) as PatchUserRequest);
    default:
      throw new InternalServerError('unknown http method');
  }
}
