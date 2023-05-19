import { GetProjectResponse, PutProjectRequest } from 'src/model/backend/api/Project';
import http from 'src/util/http';

const getProject = async () => await http.authGet<GetProjectResponse>('project');

const putProject = async (id: string, data: PutProjectRequest) =>
  await http.authPut<void, PutProjectRequest>(`project/${id}`, { data });

export default {
  getProject,
  putProject,
};
