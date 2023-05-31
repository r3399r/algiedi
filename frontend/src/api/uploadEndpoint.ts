import {
  PostUploadRequest,
  PostUploadResponse,
  PutUploadIdCoverRequest,
} from 'src/model/backend/api/Upload';
import http from 'src/util/http';

const postUpload = async (data: PostUploadRequest) =>
  await http.authPost<PostUploadResponse, PostUploadRequest>('upload', { data });

const putUploadIdCover = async (id: string, data: PutUploadIdCoverRequest) =>
  await http.authPut<void, PutUploadIdCoverRequest>(`upload/${id}/cover`, { data });

export default {
  postUpload,
  putUploadIdCover,
};
