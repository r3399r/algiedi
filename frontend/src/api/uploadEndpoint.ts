import { PostUploadRequest, PutUploadIdRequest } from 'src/model/backend/api/Upload';
import http from 'src/util/http';

const postUpload = async (data: PostUploadRequest) =>
  await http.authPost<void, PostUploadRequest>('upload', { data });

const putUploadId = async (id: string, data: PutUploadIdRequest) =>
  await http.authPut<void, PutUploadIdRequest>(`upload/${id}`, { data });

export default {
  postUpload,
  putUploadId,
};
