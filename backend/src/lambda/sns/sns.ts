import { bindings } from 'src/bindings';
import { SnsService } from 'src/logic/SnsService';
import { PostSnsRequest } from 'src/model/api/Sns';
import { BadRequestError, InternalServerError } from 'src/model/error';
import { LambdaContext, LambdaEvent, LambdaOutput } from 'src/model/Lambda';
import { errorOutput, successOutput } from 'src/util/outputHelper';

export async function sns(
  event: LambdaEvent,
  _context?: LambdaContext
): Promise<LambdaOutput> {
  console.log(event);
  let service: SnsService | null = null;
  try {
    service = bindings.get(SnsService);

    let res: unknown;

    switch (event.resource) {
      case '/api/sns':
        res = await apiSns(event, service);
        break;
      default:
        throw new InternalServerError('unknown resource');
    }

    return successOutput(res);
  } catch (e) {
    return errorOutput(e);
  }
}

async function apiSns(event: LambdaEvent, service: SnsService) {
  if (event.headers === null)
    throw new BadRequestError('headers should not be empty');
  switch (event.httpMethod) {
    case 'POST':
      if (event.body === null)
        throw new BadRequestError('body should not be empty');

      return service.sendSns(JSON.parse(event.body) as PostSnsRequest);
    default:
      throw new InternalServerError('unknown http method');
  }
}
