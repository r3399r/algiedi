import { bindings } from 'src/bindings';
import { UserService } from 'src/logic/UserService';
import { PatchUserRequest, PutUserAvatarRequest } from 'src/model/api/User';
import { BadRequestError } from 'src/model/error';
import { LambdaEvent } from 'src/model/Lambda';

let event: LambdaEvent;
let service: UserService;

export default async (lambdaEvent: LambdaEvent) => {
  event = lambdaEvent;
  service = bindings.get(UserService);

  switch (event.resource) {
    case '/api/user':
      return await userDefault();
    case '/api/user/avatar':
      return await updateAvatar();
    case '/api/user/{id}/follow':
      return await follow();
    case '/api/user/{id}/unfollow':
      return await unfollow();
  }

  throw new BadRequestError('unexpected resource');
};

const userDefault = async () => {
  switch (event.httpMethod) {
    case 'PATCH':
      if (event.body === null)
        throw new BadRequestError('body should not be empty');

      return service.initUser(JSON.parse(event.body) as PatchUserRequest);
  }
  throw new Error('unexpected httpMethod');
};

const updateAvatar = async () => {
  if (event.body === null)
    throw new BadRequestError('body should not be empty');
  switch (event.httpMethod) {
    case 'PUT':
      return service.updateAvatar(
        JSON.parse(event.body) as PutUserAvatarRequest
      );
  }
  throw new Error('unexpected httpMethod');
};

const follow = async () => {
  if (event.pathParameters === null)
    throw new BadRequestError('pathParameters should not be empty');
  switch (event.httpMethod) {
    case 'POST':
      return service.followUser(event.pathParameters.id);
  }
  throw new Error('unexpected httpMethod');
};

const unfollow = async () => {
  if (event.pathParameters === null)
    throw new BadRequestError('pathParameters should not be empty');
  switch (event.httpMethod) {
    case 'POST':
      return service.unfollowUser(event.pathParameters.id);
  }
  throw new Error('unexpected httpMethod');
};
