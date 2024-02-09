import { DetailedNotification } from 'src/model/backend/api/Notification';
import { Chat, WebsocketMessage } from 'src/model/backend/api/Ws';
import { setLastNotification } from 'src/redux/apiSlice';
import { dispatch, getState } from 'src/redux/store';
import { openSuccessSnackbar } from 'src/redux/uiSlice';
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
      if (res.a === 'chat') {
        dispatch(setLastChat((res as WebsocketMessage<Chat>).d));
        if (res.d.user.id !== userId)
          dispatch(
            openSuccessSnackbar(`You've just received a message from ${res.d.user.username}`),
          );
      } else dispatch(setLastNotification((res as WebsocketMessage<DetailedNotification>).d));
    },
    () => console.log('ws error'),
    () => console.log('ws open'),
  );
};
