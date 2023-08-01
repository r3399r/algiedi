import { useDispatch, useSelector } from 'react-redux';
import useWebSocket from 'react-use-websocket';
import { Chat, WebsocketResponse } from 'src/model/backend/api/Ws';
import { RootState } from 'src/redux/store';
import { setLastChat } from 'src/redux/wsSlice';

const useWs = () => {
  const { id: userId } = useSelector((root: RootState) => root.me);
  const dispatch = useDispatch();

  return useWebSocket(`${window.location.origin.replace(/^http/, 'ws')}/socket`, {
    queryParams: { userId },
    shouldReconnect: () => true,
    onMessage: ({ data }) => {
      const res: WebsocketResponse = JSON.parse(data);
      if (res.a === 'chat') dispatch(setLastChat((res as WebsocketResponse<Chat>).d));
    },
    onOpen: () => console.log('ws open'),
    onClose: () => console.log('ws close'),
    onError: () => console.log('ws error'),
  });
};

export default useWs;
