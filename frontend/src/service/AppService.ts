import { DetailedNotification } from 'src/model/backend/api/Notification';
import { Chat, WebsocketMessage } from 'src/model/backend/api/Ws';
import { NotificationType } from 'src/model/backend/constant/Notification';
import { setLastNotification } from 'src/redux/apiSlice';
import { dispatch, getState } from 'src/redux/store';
import { openSnackbarChat } from 'src/redux/uiSlice';
import { setLastChat } from 'src/redux/wsSlice';
import { wsSend, wsStart } from 'src/util/wsTick';

export const wsInit = () => {
  const { id: userId } = getState().me;
  if (userId === '') return;
  wsStart(
    userId,
    (data) => {
      const res: WebsocketMessage = JSON.parse(data);
      if (res.a === 'channel' || res.a === 'ping') return;
      if (res.a === 'chat') {
        dispatch(setLastChat((res as WebsocketMessage<Chat>).d));
        if (res.d.user?.id !== userId)
          dispatch(openSnackbarChat((res as WebsocketMessage<Chat>).d));
      } else if (Object.values(NotificationType).includes(res.a))
        dispatch(setLastNotification((res as WebsocketMessage<DetailedNotification>).d));
    },
    () => console.log('ws error'),
    () => console.log('ws open'),
  );

  setInterval(() => {
    wsSend({
      action: 'ping',
    });
  }, 10 * 60 * 1000);
};
