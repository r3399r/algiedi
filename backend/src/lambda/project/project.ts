import { bindings } from 'src/bindings';
import { ProjectService } from 'src/logic/ProjectService';
import {
  PostProjectIdOriginalRequest,
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
      case '/api/project/{id}/start':
        res = await apiProjectIdStart(event, service);
        break;
      case '/api/project/{id}/original':
        res = await apiProjectIdOriginal(event, service);
        break;
      case '/api/project/{id}/approval/{uid}':
        res = await apiProjectIdApproval(event, service);
        break;
      case '/api/project/{id}/ready':
        res = await apiProjectIdReady(event, service);
        break;
      case '/api/project/{id}/view':
        res = await apiProjectIdView(event, service);
        break;
      case '/api/project/{id}/publish':
        res = await apiProjectIdPublish(event, service);
        break;
      case '/api/project/{id}/cover':
        res = await apiProjectIdCover(event, service);
        break;
      case '/api/project/{id}/chat':
        res = await apiProjectIdChat(event, service);
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
      return service.getMyProjects();
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

async function apiProjectIdStart(event: LambdaEvent, service: ProjectService) {
  if (event.pathParameters === null)
    throw new BadRequestError('pathParameters should not be empty');
  if (event.headers === null)
    throw new BadRequestError('headers should not be empty');
  switch (event.httpMethod) {
    case 'POST':
      return service.startProject(event.pathParameters.id);
    default:
      throw new InternalServerError('unknown http method');
  }
}

async function apiProjectIdOriginal(
  event: LambdaEvent,
  service: ProjectService
) {
  if (event.pathParameters === null)
    throw new BadRequestError('pathParameters should not be empty');
  if (event.headers === null)
    throw new BadRequestError('headers should not be empty');
  if (event.body === null)
    throw new BadRequestError('body should not be empty');
  switch (event.httpMethod) {
    case 'POST':
      return service.addOriginal(
        event.pathParameters.id,
        JSON.parse(event.body) as PostProjectIdOriginalRequest
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
      return service.projectApproval(
        event.pathParameters.id,
        event.pathParameters.uid
      );
    default:
      throw new InternalServerError('unknown http method');
  }
}

async function apiProjectIdReady(event: LambdaEvent, service: ProjectService) {
  if (event.pathParameters === null)
    throw new BadRequestError('pathParameters should not be empty');
  if (event.headers === null)
    throw new BadRequestError('headers should not be empty');
  switch (event.httpMethod) {
    case 'PUT':
      return service.projectReady(event.pathParameters.id);
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

async function apiProjectIdPublish(
  event: LambdaEvent,
  service: ProjectService
) {
  if (event.pathParameters === null)
    throw new BadRequestError('pathParameters should not be empty');
  if (event.headers === null)
    throw new BadRequestError('headers should not be empty');
  switch (event.httpMethod) {
    case 'POST':
      return service.publishProject(event.pathParameters.id);
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
      return service.updateProjectCover(
        event.pathParameters.id,
        JSON.parse(event.body) as PutProjectIdCoverRequest
      );
    default:
      throw new InternalServerError('unknown http method');
  }
}

async function apiProjectIdChat(event: LambdaEvent, service: ProjectService) {
  if (event.pathParameters === null)
    throw new BadRequestError('pathParameters should not be empty');
  if (event.headers === null)
    throw new BadRequestError('headers should not be empty');
  switch (event.httpMethod) {
    case 'GET':
      return service.getProjectChat(event.pathParameters.id);
    default:
      throw new InternalServerError('unknown http method');
  }
}
