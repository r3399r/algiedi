import { PostCreationIdCommentRequest } from 'src/model/backend/api/Creation';
import http from 'src/util/http';

const postCreationIdLike = async (id: string) => await http.authPost(`creation/${id}/like`);

const postCreationIdUnlike = async (id: string) => await http.authPost(`creation/${id}/unlike`);

const postCreationIdComment = async (id: string, data: PostCreationIdCommentRequest) =>
  await http.authPost(`creation/${id}/comment`, { data });

export default {
  postCreationIdLike,
  postCreationIdUnlike,
  postCreationIdComment,
};
