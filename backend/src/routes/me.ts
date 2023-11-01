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
    case '/api/me/exhibits/original':
      return await meOriginal();
    case '/api/me/exhibits/inspiration':
      return await meInspiration();
    case '/api/me/exhibits/likes':
      return await meLikes();
    case '/api/me/exhibits/follows':
      return await meFollow();
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

export const meOriginal = async () => {
  switch (event.httpMethod) {
    case 'GET':
      return await service.getOriginal(event.queryStringParameters);
  }

  throw new Error('unexpected httpMethod');
};

export const meInspiration = async () => {
  switch (event.httpMethod) {
    case 'GET':
      return await service.getInspiration(event.queryStringParameters);
  }

  throw new Error('unexpected httpMethod');
};

export const meLikes = async () => {
  switch (event.httpMethod) {
    case 'GET':
      return await service.getLikeList(event.queryStringParameters);
  }

  throw new Error('unexpected httpMethod');
};

export const meFollow = async () => {
  switch (event.httpMethod) {
    case 'GET':
      return await service.getFolloweeList(event.queryStringParameters);
  }

  throw new Error('unexpected httpMethod');
};
