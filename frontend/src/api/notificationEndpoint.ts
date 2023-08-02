import {
  GetNotificationResponse,
  PatchNotificationResponse,
} from 'src/model/backend/api/Notification';
import http from 'src/util/http';

const getNotification = async () => await http.authGet<GetNotificationResponse>('notification');

const patchNotificationIdRead = async (id: string) =>
  await http.authPatch<PatchNotificationResponse>(`notification/${id}/read`);

export default {
  getNotification,
  patchNotificationIdRead,
};
