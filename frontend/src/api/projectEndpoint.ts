import { GetProjectResponse, PutProjectRequest } from 'src/model/backend/api/Project';
import http from 'src/util/http';

const getProject = async () => await http.authGet<GetProjectResponse>('project');

const putProject = async (id: string, data: PutProjectRequest) =>
  await http.authPut<void, PutProjectRequest>(`project/${id}`, { data });

const putProjectIdApprovalCid = async (id: string, cid: string) =>
  await http.authPut(`project/${id}/approval/${cid}`);

const patchProjectIdView = async (id: string) => await http.authPatch(`project/${id}/view`);

export default {
  getProject,
  putProject,
  putProjectIdApprovalCid,
  patchProjectIdView,
};
