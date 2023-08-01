import { bindings } from 'src/bindings';
import { CreationService } from 'src/logic/CreationService';
import { PostCreationIdCommentRequest } from 'src/model/api/Creation';
import { BadRequestError, InternalServerError } from 'src/model/error';
import { LambdaContext, LambdaEvent, LambdaOutput } from 'src/model/Lambda';
import { errorOutput, successOutput } from 'src/util/lambdaHelper';
import { LambdaSetup } from 'src/util/LambdaSetup';

export async function creation(
  event: LambdaEvent,
  _context?: LambdaContext
): Promise<LambdaOutput> {
  let service: CreationService | null = null;
  try {
    LambdaSetup.setup(event);
    service = bindings.get(CreationService);

    let res: unknown;

    switch (event.resource) {
      case '/api/creation/{id}/like':
        res = await apiCreationIdLike(event, service);
        break;
      case '/api/creation/{id}/unlike':
        res = await apiCreationIdUnlike(event, service);
        break;
      case '/api/creation/{id}/comment':
        res = await apiCreationIdComment(event, service);
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

async function apiCreationIdLike(event: LambdaEvent, service: CreationService) {
  if (event.pathParameters === null)
    throw new BadRequestError('pathParameters should not be empty');
  if (event.headers === null)
    throw new BadRequestError('headers should not be empty');
  switch (event.httpMethod) {
    case 'POST':
      return service.likeCreation(event.pathParameters.id);
    default:
      throw new InternalServerError('unknown http method');
  }
}

async function apiCreationIdUnlike(
  event: LambdaEvent,
  service: CreationService
) {
  if (event.pathParameters === null)
    throw new BadRequestError('pathParameters should not be empty');
  if (event.headers === null)
    throw new BadRequestError('headers should not be empty');
  switch (event.httpMethod) {
    case 'POST':
      return service.unlikeCreation(event.pathParameters.id);
    default:
      throw new InternalServerError('unknown http method');
  }
}

async function apiCreationIdComment(
  event: LambdaEvent,
  service: CreationService
) {
  if (event.pathParameters === null)
    throw new BadRequestError('pathParameters should not be empty');
  if (event.headers === null)
    throw new BadRequestError('headers should not be empty');
  if (event.body === null)
    throw new BadRequestError('body should not be empty');
  switch (event.httpMethod) {
    case 'POST':
      return service.commentCreation(
        event.pathParameters.id,
        JSON.parse(event.body) as PostCreationIdCommentRequest
      );
    default:
      throw new InternalServerError('unknown http method');
  }
}
