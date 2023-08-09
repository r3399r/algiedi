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
      case '/api/user/{id}/follow':
        res = await apiUserIdFollow(event, service);
        break;
      case '/api/user/{id}/unfollow':
        res = await apiUserIdUnfollow(event, service);
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

async function apiUser(event: LambdaEvent, service: UserService) {
  if (event.headers === null)
    throw new BadRequestError('headers should not be empty');
  switch (event.httpMethod) {
    case 'PATCH':
      if (event.body === null)
        throw new BadRequestError('body should not be empty');

      return service.initUser(JSON.parse(event.body) as PatchUserRequest);
    default:
      throw new InternalServerError('unknown http method');
  }
}

async function apiUserIdFollow(event: LambdaEvent, service: UserService) {
  if (event.pathParameters === null)
    throw new BadRequestError('pathParameters should not be empty');
  if (event.headers === null)
    throw new BadRequestError('headers should not be empty');
  switch (event.httpMethod) {
    case 'POST':
      return service.followUser(event.pathParameters.id);
    default:
      throw new InternalServerError('unknown http method');
  }
}

async function apiUserIdUnfollow(event: LambdaEvent, service: UserService) {
  if (event.pathParameters === null)
    throw new BadRequestError('pathParameters should not be empty');
  if (event.headers === null)
    throw new BadRequestError('headers should not be empty');
  switch (event.httpMethod) {
    case 'POST':
      return service.unfollowUser(event.pathParameters.id);
    default:
      throw new InternalServerError('unknown http method');
  }
}
