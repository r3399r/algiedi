import { bindings } from 'src/bindings';
import { CreationService } from 'src/logic/CreationService';
import { PostCreationIdCommentRequest } from 'src/model/api/Creation';
import { BadRequestError } from 'src/model/error';
import { LambdaEvent } from 'src/model/Lambda';

let event: LambdaEvent;
let service: CreationService;

export default async (lambdaEvent: LambdaEvent) => {
  event = lambdaEvent;
  service = bindings.get(CreationService);

  switch (event.resource) {
    case '/api/creation/{id}/like':
      return await like();
    case '/api/creation/{id}/unlike':
      return await unlike();
    case '/api/creation/{id}/comment':
      return await comment();
  }

  throw new BadRequestError('unexpected resource');
};

const like = async () => {
  if (event.pathParameters === null)
    throw new BadRequestError('pathParameters should not be empty');
  switch (event.httpMethod) {
    case 'POST':
      return await service.likeCreation(event.pathParameters.id);
  }

  throw new Error('unexpected httpMethod');
};

const unlike = async () => {
  if (event.pathParameters === null)
    throw new BadRequestError('pathParameters should not be empty');
  switch (event.httpMethod) {
    case 'POST':
      return await service.unlikeCreation(event.pathParameters.id);
  }

  throw new Error('unexpected httpMethod');
};

const comment = async () => {
  if (event.pathParameters === null)
    throw new BadRequestError('pathParameters should not be empty');
  if (event.body === null)
    throw new BadRequestError('body should not be empty');
  switch (event.httpMethod) {
    case 'POST':
      return await service.commentCreation(
        event.pathParameters.id,
        JSON.parse(event.body) as PostCreationIdCommentRequest
      );
  }

  throw new Error('unexpected httpMethod');
};
