import { bindings } from 'src/bindings';
import { NotificationService } from 'src/logic/NotificationService';
import { BadRequestError } from 'src/model/error';
import { LambdaEvent } from 'src/model/Lambda';

let event: LambdaEvent;
let service: NotificationService;

export default async (lambdaEvent: LambdaEvent) => {
  event = lambdaEvent;
  service = bindings.get(NotificationService);

  switch (event.resource) {
    case '/api/notification':
      return await listNotifications();
    case '/api/notification/{id}/read':
      return await readNotification();
  }

  throw new BadRequestError('unexpected resource');
};

const listNotifications = () => {
  console.log(event);
  switch (event.httpMethod) {
    case 'GET':
      return service.getNotifications();
  }
  throw new Error('unexpected httpMethod');
};

const readNotification = () => {
  if (event.pathParameters === null)
    throw new BadRequestError('pathParameters should not be empty');
  switch (event.httpMethod) {
    case 'PATCH':
      return service.setNotificationAsRead(event.pathParameters.id);
  }
  throw new Error('unexpected httpMethod');
};
