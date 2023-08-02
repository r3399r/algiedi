import { Chat, WebsocketResponse } from 'src/model/backend/api/Ws';
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
      const res: WebsocketResponse = JSON.parse(data);
      if (res.a === 'chat') dispatch(setLastChat((res as WebsocketResponse<Chat>).d));
      if (res.a === 'project-start')
        dispatch(setLastNotification((res as WebsocketResponse<Notification>).d));
      if (res.a === 'project-reject')
        dispatch(setLastNotification((res as WebsocketResponse<Notification>).d));
    },
    () => console.log('ws error'),
    () => console.log('ws open'),
  );
};
