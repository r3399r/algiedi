import {
  PostCreationIdCommentRequest,
  PostCreationIdEditRequest,
} from 'src/model/backend/api/Creation';
import http from 'src/util/http';

const postCreationIdEdit = async (id: string, data: PostCreationIdEditRequest) =>
  await http.authPost(`creation/${id}/edit`, { data });

const postCreationIdLike = async (id: string) => await http.authPost(`creation/${id}/like`);

const postCreationIdUnlike = async (id: string) => await http.authPost(`creation/${id}/unlike`);

const postCreationIdComment = async (id: string, data: PostCreationIdCommentRequest) =>
  await http.authPost(`creation/${id}/comment`, { data });

export default {
  postCreationIdEdit,
  postCreationIdLike,
  postCreationIdUnlike,
  postCreationIdComment,
};
