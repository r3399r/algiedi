import {
  GetProjectResponse,
  PostProjectIdOriginalRequest,
  PostProjectIdPublishRequest,
  PutProjectRequest,
} from 'src/model/backend/api/Project';
import http from 'src/util/http';

const getProject = async () => await http.authGet<GetProjectResponse>('project');

const putProject = async (id: string, data: PutProjectRequest) =>
  await http.authPut<void, PutProjectRequest>(`project/${id}`, { data });

const postProjectIdStart = async (id: string) => await http.authPost<void>(`project/${id}/start`);

const postProjectIdOriginal = async (id: string, data: PostProjectIdOriginalRequest) =>
  await http.authPost<void, PostProjectIdOriginalRequest>(`project/${id}/original`, { data });

const putProjectIdApprovalCid = async (id: string, cid: string) =>
  await http.authPut(`project/${id}/approval/${cid}`);

const patchProjectIdView = async (id: string) => await http.authPatch(`project/${id}/view`);

const postProjectIdPublish = async (id: string, data: PostProjectIdPublishRequest) =>
  await http.authPost(`project/${id}/publish`, { data });

export default {
  getProject,
  putProject,
  postProjectIdStart,
  postProjectIdOriginal,
  putProjectIdApprovalCid,
  patchProjectIdView,
  postProjectIdPublish,
};
