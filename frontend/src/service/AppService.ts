import { Chat, WebsocketMessage } from 'src/model/backend/api/Ws';
import { Notification } from 'src/model/backend/entity/NotificationEntity';
import { setLastNotification } from 'src/redux/apiSlice';
import { dispatch, getState } from 'src/redux/store';
import { setLastChat } from 'src/redux/wsSlice';
import { wsStart } from 'src/util/wsTick';

export const wsInit = () => {
  const { id: userId } = getState().me;
  if (userId === '') return;
  wsStart(
    userId,
    (data) => {
      const res: WebsocketMessage = JSON.parse(data);
      if (res.a === 'channel') return;
      if (res.a === 'chat') dispatch(setLastChat((res as WebsocketMessage<Chat>).d));
      else dispatch(setLastNotification((res as WebsocketMessage<Notification>).d));
    },
    () => console.log('ws error'),
    () => console.log('ws open'),
  );
};
