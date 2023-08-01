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
      target: 'wss://dev.gotronmusic.com/',
      ws: true,
      changeOrigin: true,
    }),
  );
};
