import { GetProjectResponse } from 'src/model/backend/model/api/Project';
import http from 'src/util/http';

const getProject = async () => await http.authGet<GetProjectResponse>('project');

export default {
  getProject,
};
