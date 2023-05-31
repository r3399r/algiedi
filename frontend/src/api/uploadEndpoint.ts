import {
  PostUploadRequest,
  PostUploadResponse,
  PutUploadIdCoverRequest,
  PutUploadIdRequest,
} from 'src/model/backend/api/Upload';
import http from 'src/util/http';

const postUpload = async (data: PostUploadRequest) =>
  await http.authPost<PostUploadResponse, PostUploadRequest>('upload', { data });

const putUploadId = async (id: string, data: PutUploadIdRequest) =>
  await http.authPut<void, PutUploadIdRequest>(`upload/${id}`, { data });

const putUploadIdCover = async (id: string, data: PutUploadIdCoverRequest) =>
  await http.authPut<void, PutUploadIdCoverRequest>(`upload/${id}/cover`, { data });

export default {
  postUpload,
  putUploadId,
  putUploadIdCover,
};
