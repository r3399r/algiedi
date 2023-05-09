import { bindings } from 'src/bindings';
import { UploadService } from 'src/logic/UploadService';
import { PostUploadRequest } from 'src/model/api/Upload';
import { BadRequestError, InternalServerError } from 'src/model/error';
import { LambdaContext, LambdaEvent, LambdaOutput } from 'src/model/Lambda';
import { errorOutput, successOutput } from 'src/util/lambdaHelper';
import { LambdaSetup } from 'src/util/LambdaSetup';

export async function upload(
  event: LambdaEvent,
  _context?: LambdaContext
): Promise<LambdaOutput> {
  let service: UploadService | null = null;
  try {
    LambdaSetup.setup(event);
    service = bindings.get(UploadService);

    let res: unknown;

    switch (event.resource) {
      case '/api/upload':
        res = await apiUpload(event, service);
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

async function apiUpload(event: LambdaEvent, service: UploadService) {
  if (event.headers === null)
    throw new BadRequestError('headers should not be empty');
  switch (event.httpMethod) {
    case 'POST':
      if (event.body === null)
        throw new BadRequestError('body should not be empty');

      return service.upload(JSON.parse(event.body) as PostUploadRequest);
    default:
      throw new InternalServerError('unknown http method');
  }
}
