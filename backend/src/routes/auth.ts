import { bindings } from 'src/bindings';
import { AuthService } from 'src/logic/AuthService';
import { PostAuthLoginRequest } from 'src/model/api/Auth';
import { BadRequestError } from 'src/model/error';
import { LambdaEvent } from 'src/model/Lambda';

let event: LambdaEvent;
let service: AuthService;

export default async (lambdaEvent: LambdaEvent) => {
  event = lambdaEvent;
  service = bindings.get(AuthService);

  switch (event.resource) {
    case '/api/auth/login':
      return await authLogin();
  }

  throw new BadRequestError('unexpected resource');
};

const authLogin = async () => {
  switch (event.httpMethod) {
    case 'POST':
      if (event.body === null)
        throw new BadRequestError('body should not be empty');

      return await service.login(
        JSON.parse(event.body) as PostAuthLoginRequest
      );
  }

  throw new Error('unexpected httpMethod');
};
