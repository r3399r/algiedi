import { bindings } from 'src/bindings';
import { ViewService } from 'src/logic/ViewService';
import { BadRequestError } from 'src/model/error';
import { LambdaEvent } from 'src/model/Lambda';

let event: LambdaEvent;
let service: ViewService;

export default async (lambdaEvent: LambdaEvent) => {
  event = lambdaEvent;
  service = bindings.get(ViewService);

  switch (event.resource) {
    case '/api/view/{id}':
      return await viewCreation();
  }

  throw new BadRequestError('unexpected resource');
};

const viewCreation = () => {
  if (event.pathParameters === null)
    throw new BadRequestError('pathParameters should not be empty');
  switch (event.httpMethod) {
    case 'PATCH':
      return service.beingViewed(event.pathParameters.id);
  }
  throw new Error('unexpected httpMethod');
};
