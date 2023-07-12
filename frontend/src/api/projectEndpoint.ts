import {
  GetProjectResponse,
  PostProjectIdOriginalRequest,
  PutProjectIdCoverRequest,
  PutProjectRequest,
} from 'src/model/backend/api/Project';
import http from 'src/util/http';

const getProject = async () => await http.authGet<GetProjectResponse>('project');

const putProject = async (id: string, data: PutProjectRequest) =>
  await http.authPut<void, PutProjectRequest>(`project/${id}`, { data });

const postProjectIdStart = async (id: string) => await http.authPost<void>(`project/${id}/start`);

const postProjectIdOriginal = async (id: string, data: PostProjectIdOriginalRequest) =>
  await http.authPost<void, PostProjectIdOriginalRequest>(`project/${id}/original`, { data });

const putProjectIdApprovalUid = async (id: string, uid: string) =>
  await http.authPut(`project/${id}/approval/${uid}`);

const putProjectIdReady = async (id: string) => await http.authPut(`project/${id}/ready`);

const patchProjectIdView = async (id: string) => await http.authPatch(`project/${id}/view`);

const postProjectIdPublish = async (id: string) => await http.authPost(`project/${id}/publish`);

const putProjectIdCover = async (id: string, data: PutProjectIdCoverRequest) =>
  await http.authPut(`project/${id}/cover`, { data });

export default {
  getProject,
  putProject,
  postProjectIdStart,
  postProjectIdOriginal,
  putProjectIdApprovalUid,
  putProjectIdReady,
  patchProjectIdView,
  postProjectIdPublish,
  putProjectIdCover,
};
