/* eslint-disable */
const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function (app) {
  app.use(
    createProxyMiddleware('/api', {
      target: 'https://dev.gotronmusic.com/',
      changeOrigin: true,
    }),
  );
  app.use(
    createProxyMiddleware('/socket', {
      target: 'wss://0nnwr8j4y2.execute-api.ap-southeast-1.amazonaws.com/',
      ws: true,
      changeOrigin: true,
    }),
  );
};
