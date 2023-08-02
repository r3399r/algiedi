import notificationEndpoint from 'src/api/notificationEndpoint';
import { dispatch } from 'src/redux/store';
import { finishWaiting, startWaiting } from 'src/redux/uiSlice';

export const getNotification = async () => {
  try {
    dispatch(startWaiting());

    const res = await notificationEndpoint.getNotification();

    return res.data;
  } finally {
    dispatch(finishWaiting());
  }
};

export const readNotification = async (id: string) => {
  try {
    dispatch(startWaiting());

    const res = await notificationEndpoint.patchNotificationIdRead(id);

    return res.data;
  } finally {
    dispatch(finishWaiting());
  }
};
