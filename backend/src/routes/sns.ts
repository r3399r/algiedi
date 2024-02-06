import { bindings } from 'src/bindings';
import { SnsService } from 'src/logic/SnsService';
import {
  PostSnsContactRequest,
  PostSnsSubscribeRequest,
} from 'src/model/api/Sns';
import { BadRequestError } from 'src/model/error';
import { LambdaEvent } from 'src/model/Lambda';

let event: LambdaEvent;
let service: SnsService;

export default async (lambdaEvent: LambdaEvent) => {
  event = lambdaEvent;
  service = bindings.get(SnsService);

  switch (event.resource) {
    case '/api/sns/contact':
      return await snsContact();
    case '/api/sns/subscribe':
      return await snsSubscribe();
  }

  throw new BadRequestError('unexpected resource');
};

const snsContact = async () => {
  if (event.headers === null)
    throw new BadRequestError('headers should not be empty');
  switch (event.httpMethod) {
    case 'POST':
      if (event.body === null)
        throw new BadRequestError('body should not be empty');

      return service.sendContactUs(
        JSON.parse(event.body) as PostSnsContactRequest
      );
  }
  throw new Error('unexpected httpMethod');
};

const snsSubscribe = async () => {
  if (event.headers === null)
    throw new BadRequestError('headers should not be empty');
  switch (event.httpMethod) {
    case 'POST':
      if (event.body === null)
        throw new BadRequestError('body should not be empty');

      return service.sendSubscribeNewsletter(
        JSON.parse(event.body) as PostSnsSubscribeRequest
      );
  }
  throw new Error('unexpected httpMethod');
};
