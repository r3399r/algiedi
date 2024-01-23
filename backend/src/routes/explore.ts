import { bindings } from 'src/bindings';
import { ExploreService } from 'src/logic/ExploreService';
import {
  GetExploreParams,
  GetExploreSearchParams,
  GetExploreUserParams,
} from 'src/model/api/Explore';
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
    case '/api/explore/user':
      return await listUsers();
    case '/api/explore/user/auth':
      return await listUsers();
    case '/api/explore/featured':
      return await getFeaturedExplores();
    case '/api/explore/search':
      return await searchExplores();
    case '/api/explore/{id}':
      return await findExplore();
    case '/api/explore/{id}/auth':
      return await findExplore();
    case '/api/explore/user/{id}':
      return await findUser();
    case '/api/explore/user/{id}/auth':
      return await findUser();
  }

  throw new BadRequestError('unexpected resource');
};

const listExplores = async () => {
  switch (event.httpMethod) {
    case 'GET':
      return await service.getExplore(
        event.queryStringParameters as GetExploreParams | null
      );
  }

  throw new Error('unexpected httpMethod');
};

const listUsers = async () => {
  switch (event.httpMethod) {
    case 'GET':
      return await service.getExploreUser(
        event.queryStringParameters as GetExploreUserParams | null
      );
  }

  throw new Error('unexpected httpMethod');
};

const getFeaturedExplores = async () => {
  switch (event.httpMethod) {
    case 'GET':
      return await service.getFeaturedExplore();
  }

  throw new Error('unexpected httpMethod');
};

const searchExplores = async () => {
  switch (event.httpMethod) {
    case 'GET':
      return await service.getExploresByKeyword(
        event.queryStringParameters as GetExploreSearchParams | null
      );
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

const findUser = async () => {
  if (event.pathParameters === null)
    throw new BadRequestError('pathParameters should not be empty');
  switch (event.httpMethod) {
    case 'GET':
      return await service.getUserById(event.pathParameters.id);
  }

  throw new Error('unexpected httpMethod');
};
