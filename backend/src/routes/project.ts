import { bindings } from 'src/bindings';
import { ProjectService } from 'src/logic/ProjectService';
import {
  PostProjectIdOriginalRequest,
  PutProjectIdCoverRequest,
  PutProjectRequest,
} from 'src/model/api/Project';
import { BadRequestError } from 'src/model/error';
import { LambdaEvent } from 'src/model/Lambda';

let event: LambdaEvent;
let service: ProjectService;

export default async (lambdaEvent: LambdaEvent) => {
  event = lambdaEvent;
  service = bindings.get(ProjectService);

  switch (event.resource) {
    case '/api/project':
      return await listProjects();
    case '/api/project/{id}':
      return await updateProject();
    case '/api/project/{id}/start':
      return await start();
    case '/api/project/{id}/original':
      return await addOriginal();
    case '/api/project/{id}/approval/{uid}':
      return await projectApproval();
    case '/api/project/{id}/ready':
      return await projectReady();
    case '/api/project/{id}/view':
      return await setLastProject();
    case '/api/project/{id}/publish':
      return await publish();
    case '/api/project/{id}/cover':
      return await updateCover();
    case '/api/project/{id}/chat':
      return await chat();
  }

  throw new BadRequestError('unexpected resource');
};

const listProjects = async () => {
  switch (event.httpMethod) {
    case 'GET':
      return await service.getMyProjects();
  }

  throw new Error('unexpected httpMethod');
};

const updateProject = async () => {
  if (event.pathParameters === null)
    throw new BadRequestError('pathParameters should not be empty');
  if (event.body === null)
    throw new BadRequestError('body should not be empty');
  switch (event.httpMethod) {
    case 'PUT':
      return service.updateProject(
        event.pathParameters.id,
        JSON.parse(event.body) as PutProjectRequest
      );
  }

  throw new Error('unexpected httpMethod');
};

const start = async () => {
  if (event.pathParameters === null)
    throw new BadRequestError('pathParameters should not be empty');
  switch (event.httpMethod) {
    case 'POST':
      return service.startProject(event.pathParameters.id);
  }

  throw new Error('unexpected httpMethod');
};

async function addOriginal() {
  if (event.pathParameters === null)
    throw new BadRequestError('pathParameters should not be empty');
  if (event.body === null)
    throw new BadRequestError('body should not be empty');
  switch (event.httpMethod) {
    case 'POST':
      return service.addOriginal(
        event.pathParameters.id,
        JSON.parse(event.body) as PostProjectIdOriginalRequest
      );
  }

  throw new Error('unexpected httpMethod');
}

async function projectApproval() {
  if (event.pathParameters === null)
    throw new BadRequestError('pathParameters should not be empty');
  switch (event.httpMethod) {
    case 'PUT':
      return service.projectApproval(
        event.pathParameters.id,
        event.pathParameters.uid
      );
  }
  throw new Error('unexpected httpMethod');
}

async function projectReady() {
  if (event.pathParameters === null)
    throw new BadRequestError('pathParameters should not be empty');
  switch (event.httpMethod) {
    case 'PUT':
      return service.projectReady(event.pathParameters.id);
  }

  throw new Error('unexpected httpMethod');
}

async function setLastProject() {
  if (event.pathParameters === null)
    throw new BadRequestError('pathParameters should not be empty');
  switch (event.httpMethod) {
    case 'PATCH':
      return service.setLastProject(event.pathParameters.id);
  }
  throw new Error('unexpected httpMethod');
}

async function publish() {
  if (event.pathParameters === null)
    throw new BadRequestError('pathParameters should not be empty');
  switch (event.httpMethod) {
    case 'POST':
      return service.publishProject(event.pathParameters.id);
  }
  throw new Error('unexpected httpMethod');
}

async function updateCover() {
  if (event.pathParameters === null)
    throw new BadRequestError('pathParameters should not be empty');
  if (event.body === null)
    throw new BadRequestError('body should not be empty');
  switch (event.httpMethod) {
    case 'PUT':
      return service.updateProjectCover(
        event.pathParameters.id,
        JSON.parse(event.body) as PutProjectIdCoverRequest
      );
  }
  throw new Error('unexpected httpMethod');
}

async function chat() {
  if (event.pathParameters === null)
    throw new BadRequestError('pathParameters should not be empty');
  switch (event.httpMethod) {
    case 'GET':
      return service.getProjectChat(event.pathParameters.id);
  }
  throw new Error('unexpected httpMethod');
}
