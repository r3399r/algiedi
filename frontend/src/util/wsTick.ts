const TIMEOUT_HANDSHAKE = 5000;

enum CLOSE_CODE {
  NORMAL_CLOSURE = 1000,
  GOING_AWAY = 1001,
}

export type WebSocketHandler = {
  // url: string;
  ws: WebSocket;
  onOpen: () => void;
  onMessage: (e: MessageEvent) => void;
  onClose: (e: CloseEvent) => void;
  onError: () => void;
};

export const wsStart = (
  // url: string,
  onTick: (data: string) => void,
  onError: () => void,
  onClose: () => void,
  protocol?: string,
): Promise<WebSocketHandler> =>
  new Promise((resolve: (value: WebSocketHandler) => void, reject: (reason: any) => void) => {
    console.log(`${window.location.origin.replace(/^http/, 'ws')}/ws`);
    const ws = new WebSocket(`ws://localhost:3000/ws`, protocol);

    const timeout = setTimeout(() => {
      ws.close(CLOSE_CODE.NORMAL_CLOSURE);
      reject(new Error('open timeout'));
    }, TIMEOUT_HANDSHAKE);

    const _onMessage = (event: MessageEvent<string>) => {
      onTick(event.data);
    };

    const _onClose = (event: CloseEvent) => {
      console.log('erererere');
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
  });

export const wsStop = (handler: WebSocketHandler) => {
  // if (handler === undefined) return;
  const { ws, onOpen, onMessage, onClose, onError } = handler;
  ws.close(CLOSE_CODE.NORMAL_CLOSURE, 'manual stop');
  ws.removeEventListener('open', onOpen);
  ws.removeEventListener('message', onMessage);
  ws.removeEventListener('close', onClose);
  ws.removeEventListener('error', onError);
};

export const wsSend = (handler: WebSocketHandler, data: string) => {
  // if (handler === undefined) return;
  const { ws } = handler;
  ws.send(data);
};
