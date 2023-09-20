import { bindings } from 'src/bindings';
import { UploadService } from 'src/logic/UploadService';
import { PostUploadRequest, PutUploadIdRequest } from 'src/model/api/Upload';
import { BadRequestError } from 'src/model/error';
import { LambdaEvent } from 'src/model/Lambda';

let event: LambdaEvent;
let service: UploadService;

export default async (lambdaEvent: LambdaEvent) => {
  event = lambdaEvent;
  service = bindings.get(UploadService);

  switch (event.resource) {
    case '/api/upload':
      return await uploadDefault();
    case '/api/upload/{id}':
      return await updateUpload();
  }

  throw new BadRequestError('unexpected resource');
};

const uploadDefault = () => {
  switch (event.httpMethod) {
    case 'POST':
      if (event.body === null)
        throw new BadRequestError('body should not be empty');

      return service.upload(JSON.parse(event.body) as PostUploadRequest);
  }
  throw new Error('unexpected httpMethod');
};

const updateUpload = () => {
  if (event.pathParameters === null)
    throw new BadRequestError('pathParameters should not be empty');
  if (event.body === null)
    throw new BadRequestError('body should not be empty');
  switch (event.httpMethod) {
    case 'PUT':
      return service.updateUpload(
        event.pathParameters.id,
        JSON.parse(event.body) as PutUploadIdRequest
      );
  }
  throw new Error('unexpected httpMethod');
};
