const TIMEOUT_HANDSHAKE = 5000;

enum CLOSE_CODE {
  NORMAL_CLOSURE = 1000,
  GOING_AWAY = 1001,
}

let handler: WebSocketHandler;

export type WebSocketHandler = {
  // url: string;
  ws: WebSocket;
  onOpen: () => void;
  onMessage: (e: MessageEvent) => void;
  onClose: (e: CloseEvent) => void;
  onError: () => void;
};

export const wsStart = async (
  userId: string,
  onTick: (data: any) => void,
  onError: () => void,
  onClose: () => void,
  protocol?: string,
) => {
  handler = await new Promise(
    (resolve: (value: WebSocketHandler) => void, reject: (reason: any) => void) => {
      const ws = new WebSocket(
        `${window.location.origin.replace(/^http/, 'ws')}/socket?userId=${userId}`,
        protocol,
      );

      const timeout = setTimeout(() => {
        ws.close(CLOSE_CODE.NORMAL_CLOSURE);
        reject(new Error('open timeout'));
      }, TIMEOUT_HANDSHAKE);

      const _onMessage = (event: MessageEvent<string>) => {
        onTick(event.data);
      };

      const _onClose = (event: CloseEvent) => {
        if (event.reason !== 'manual stop') setTimeout(onClose, TIMEOUT_HANDSHAKE);
      };

      const _onError = () => {
        setTimeout(onError, TIMEOUT_HANDSHAKE);
      };

      const _onOpen = () => {
        clearTimeout(timeout);

        resolve({
          // url,
          ws,
          onOpen: _onOpen,
          onMessage: _onMessage,
          onClose: _onClose,
          onError: _onError,
        });
      };

      ws.addEventListener('open', _onOpen);
      ws.addEventListener('message', _onMessage);
      ws.addEventListener('close', _onClose);
      ws.addEventListener('error', _onError);
    },
  );
};

export const wsStop = () => {
  if (handler === undefined) return;
  const { ws, onOpen, onMessage, onClose, onError } = handler;
  ws.close(CLOSE_CODE.NORMAL_CLOSURE, 'manual stop');
  ws.removeEventListener('open', onOpen);
  ws.removeEventListener('message', onMessage);
  ws.removeEventListener('close', onClose);
  ws.removeEventListener('error', onError);
};

export const wsSend = (payload: { [key: string]: any }) => {
  if (handler === undefined || handler.ws.readyState !== 1) return;
  handler.ws.send(JSON.stringify(payload));
};
