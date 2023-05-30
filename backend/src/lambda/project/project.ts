import { bindings } from 'src/bindings';
import { ProjectService } from 'src/logic/ProjectService';
import {
  PutProjectIdCoverRequest,
  PutProjectRequest,
} from 'src/model/api/Project';
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

    let res: unknown;

    switch (event.resource) {
      case '/api/project':
        res = await apiProject(event, service);
        break;
      case '/api/project/{id}':
        res = await apiProjectId(event, service);
        break;
      case '/api/project/{id}/approval/{cid}':
        res = await apiProjectIdApproval(event, service);
        break;
      case '/api/project/{id}/view':
        res = await apiProjectIdView(event, service);
        break;
      case '/api/project/{id}/cover':
        res = await apiProjectIdCover(event, service);
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

async function apiProjectId(event: LambdaEvent, service: ProjectService) {
  if (event.pathParameters === null)
    throw new BadRequestError('pathParameters should not be empty');
  if (event.headers === null)
    throw new BadRequestError('headers should not be empty');
  if (event.body === null)
    throw new BadRequestError('body should not be empty');
  switch (event.httpMethod) {
    case 'PUT':
      return service.updateProject(
        event.pathParameters.id,
        JSON.parse(event.body) as PutProjectRequest
      );
    default:
      throw new InternalServerError('unknown http method');
  }
}

async function apiProjectIdApproval(
  event: LambdaEvent,
  service: ProjectService
) {
  if (event.pathParameters === null)
    throw new BadRequestError('pathParameters should not be empty');
  if (event.headers === null)
    throw new BadRequestError('headers should not be empty');
  switch (event.httpMethod) {
    case 'PUT':
      return service.projectAppoval(
        event.pathParameters.id,
        event.pathParameters.cid
      );
    default:
      throw new InternalServerError('unknown http method');
  }
}

async function apiProjectIdView(event: LambdaEvent, service: ProjectService) {
  if (event.pathParameters === null)
    throw new BadRequestError('pathParameters should not be empty');
  if (event.headers === null)
    throw new BadRequestError('headers should not be empty');
  switch (event.httpMethod) {
    case 'PATCH':
      return service.setLastProject(event.pathParameters.id);
    default:
      throw new InternalServerError('unknown http method');
  }
}

async function apiProjectIdCover(event: LambdaEvent, service: ProjectService) {
  if (event.pathParameters === null)
    throw new BadRequestError('pathParameters should not be empty');
  if (event.headers === null)
    throw new BadRequestError('headers should not be empty');
  if (event.body === null)
    throw new BadRequestError('body should not be empty');
  switch (event.httpMethod) {
    case 'PUT':
      return service.updateCover(
        event.pathParameters.id,
        JSON.parse(event.body) as PutProjectIdCoverRequest
      );
    default:
      throw new InternalServerError('unknown http method');
  }
}
