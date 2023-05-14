import { bindings } from 'src/bindings';
import { ProjectService } from 'src/logic/ProjectService';
import { GetProjectResponse } from 'src/model/api/Project';
import { BadRequestError, InternalServerError } from 'src/model/error';
import { LambdaContext, LambdaEvent, LambdaOutput } from 'src/model/Lambda';
import { errorOutput, successOutput } from 'src/util/lambdaHelper';
import { LambdaSetup } from 'src/util/LambdaSetup';

export async function project(
  event: LambdaEvent,
  _context?: LambdaContext
): Promise<LambdaOutput> {
  let service: ProjectService | null = null;
  try {
    LambdaSetup.setup(event);
    service = bindings.get(ProjectService);

    let res: GetProjectResponse;

    switch (event.resource) {
      case '/api/project':
        res = await apiProject(event, service);
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

async function apiProject(event: LambdaEvent, service: ProjectService) {
  if (event.headers === null)
    throw new BadRequestError('headers should not be empty');
  switch (event.httpMethod) {
    case 'GET':
      return service.getProjects();
    default:
      throw new InternalServerError('unknown http method');
  }
}
