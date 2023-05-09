import { PostUploadRequest } from 'src/model/backend/api/Upload';
import http from 'src/util/http';

const postUpload = async (data: PostUploadRequest) =>
  await http.authPost<void, PostUploadRequest>('upload', { data });

export default {
  postUpload,
};
