import notificationEndpoint from 'src/api/notificationEndpoint';
import { filterNotification, replaceNotification, setNotifications } from 'src/redux/apiSlice';
import { dispatch } from 'src/redux/store';
import { finishWaiting, startWaiting } from 'src/redux/uiSlice';

export const loadNotification = async () => {
  try {
    dispatch(startWaiting());

    const res = await notificationEndpoint.getNotification();

    dispatch(setNotifications(res.data));
  } finally {
    dispatch(finishWaiting());
  }
};

export const readNotification = async (id: string) => {
  try {
    dispatch(startWaiting());

    const res = await notificationEndpoint.patchNotificationIdRead(id);

    dispatch(replaceNotification(res.data));
  } finally {
    dispatch(finishWaiting());
  }
};

export const deleteNotification = async (id: string) => {
  try {
    dispatch(startWaiting());

    await notificationEndpoint.deleteNotificationId(id);

    dispatch(filterNotification(id));
  } finally {
    dispatch(finishWaiting());
  }
};
