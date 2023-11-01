import { bindings } from 'src/bindings';
import { MeService } from 'src/logic/MeService';
import { PutMeRequest } from 'src/model/api/Me';
import { BadRequestError } from 'src/model/error';
import { LambdaEvent } from 'src/model/Lambda';

let event: LambdaEvent;
let service: MeService;

export default async (lambdaEvent: LambdaEvent) => {
  event = lambdaEvent;
  service = bindings.get(MeService);

  switch (event.resource) {
    case '/api/me':
      return await meDefault();
    case '/api/me/exhibits/published':
      return await mePublished();
  }

  throw new BadRequestError('unexpected resource');
};

const meDefault = async () => {
  switch (event.httpMethod) {
    case 'GET':
      return await service.getMe();
    case 'PUT':
      if (event.body === null)
        throw new BadRequestError('body should not be empty');

      return await service.updateMe(JSON.parse(event.body) as PutMeRequest);
  }

  throw new Error('unexpected httpMethod');
};

export const mePublished = async () => {
  switch (event.httpMethod) {
    case 'GET':
      return await service.getPublished(event.queryStringParameters);
  }

  throw new Error('unexpected httpMethod');
};
