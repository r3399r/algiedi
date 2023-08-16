import { bindings } from 'src/bindings';
import { ExploreService } from 'src/logic/ExploreService';
import { BadRequestError, InternalServerError } from 'src/model/error';
import { LambdaContext, LambdaEvent, LambdaOutput } from 'src/model/Lambda';
import { errorOutput, successOutput } from 'src/util/lambdaHelper';
import { LambdaSetup } from 'src/util/LambdaSetup';

export async function explore(
  event: LambdaEvent,
  _context?: LambdaContext
): Promise<LambdaOutput> {
  let service: ExploreService | null = null;
  try {
    LambdaSetup.setup(event);
    service = bindings.get(ExploreService);

    let res: unknown;

    switch (event.resource) {
      case '/api/explore':
        res = await apiExplore(event, service);
        break;
      case '/api/explore/auth':
        res = await apiExplore(event, service);
        break;
      case '/api/explore/{id}':
        res = await apiExploreId(event, service);
        break;
      case '/api/explore/{id}/auth':
        res = await apiExploreId(event, service);
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

async function apiExplore(event: LambdaEvent, service: ExploreService) {
  switch (event.httpMethod) {
    case 'GET':
      return service.getExplore();
    default:
      throw new InternalServerError('unknown http method');
  }
}

async function apiExploreId(event: LambdaEvent, service: ExploreService) {
  if (event.pathParameters === null)
    throw new BadRequestError('pathParameters should not be empty');
  if (event.headers === null)
    throw new BadRequestError('headers should not be empty');
  switch (event.httpMethod) {
    case 'GET':
      return service.getExploreById(event.pathParameters.id);
    default:
      throw new InternalServerError('unknown http method');
  }
}
