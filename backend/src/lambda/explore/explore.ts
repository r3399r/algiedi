import { bindings } from 'src/bindings';
import { ExploreService } from 'src/logic/ExploreService';
import { InternalServerError } from 'src/model/error';
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
