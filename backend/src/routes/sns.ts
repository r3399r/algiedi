import { bindings } from 'src/bindings';
import { SnsService } from 'src/logic/SnsService';
import { PostSnsRequest } from 'src/model/api/Sns';
import { BadRequestError } from 'src/model/error';
import { LambdaEvent } from 'src/model/Lambda';

let event: LambdaEvent;
let service: SnsService;

export default async (lambdaEvent: LambdaEvent) => {
  event = lambdaEvent;
  service = bindings.get(SnsService);

  switch (event.resource) {
    case '/api/sns':
      return await snsDefault();
  }

  throw new BadRequestError('unexpected resource');
};

const snsDefault = async () => {
  if (event.headers === null)
    throw new BadRequestError('headers should not be empty');
  switch (event.httpMethod) {
    case 'POST':
      if (event.body === null)
        throw new BadRequestError('body should not be empty');

      return service.sendSns(JSON.parse(event.body) as PostSnsRequest);
  }
  throw new Error('unexpected httpMethod');
};
