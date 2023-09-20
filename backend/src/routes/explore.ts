import { bindings } from 'src/bindings';
import { ExploreService } from 'src/logic/ExploreService';
import { BadRequestError } from 'src/model/error';
import { LambdaEvent } from 'src/model/Lambda';

let event: LambdaEvent;
let service: ExploreService;

export default async (lambdaEvent: LambdaEvent) => {
  event = lambdaEvent;
  service = bindings.get(ExploreService);

  switch (event.resource) {
    case '/api/explore':
      return await listExplores();
    case '/api/explore/auth':
      return await listExplores();
    case '/api/explore/{id}':
      return await findExplore();
    case '/api/explore/{id}/auth':
      return await findExplore();
  }

  throw new BadRequestError('unexpected resource');
};

const listExplores = async () => {
  switch (event.httpMethod) {
    case 'GET':
      return await service.getExplore();
  }

  throw new Error('unexpected httpMethod');
};

const findExplore = async () => {
  if (event.pathParameters === null)
    throw new BadRequestError('pathParameters should not be empty');
  switch (event.httpMethod) {
    case 'GET':
      return await service.getExploreById(event.pathParameters.id);
  }

  throw new Error('unexpected httpMethod');
};
