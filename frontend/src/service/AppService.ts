import { Chat, WebsocketMessage } from 'src/model/backend/api/Ws';
import { Notification } from 'src/model/backend/entity/NotificationEntity';
import { dispatch, getState } from 'src/redux/store';
import { setLastChat, setLastNotification } from 'src/redux/wsSlice';
import { wsStart } from 'src/util/wsTick';

export const wsInit = () => {
  const { id: userId } = getState().me;
  if (userId === '') return;
  wsStart(
    userId,
    (data) => {
      const res: WebsocketMessage = JSON.parse(data);
      if (res.a === 'chat') dispatch(setLastChat((res as WebsocketMessage<Chat>).d));
      if (res.a === 'project-start')
        dispatch(setLastNotification((res as WebsocketMessage<Notification>).d));
      if (res.a === 'project-reject')
        dispatch(setLastNotification((res as WebsocketMessage<Notification>).d));
    },
    () => console.log('ws error'),
    () => console.log('ws open'),
  );
};
