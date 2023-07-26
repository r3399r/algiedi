/* eslint-disable */
const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function (app) {
  app.use(
    createProxyMiddleware('/api', {
      target: 'https://dev.gotronmusic.com/',
      changeOrigin: true,
    }),
  );
  // .use(
  //   createProxyMiddleware('/ws', {
  //     target: 'wss://dev.gotronmusic.com/',
  //     secure: false,
  //     ws: true,
  //     changeOrigin: true,
  //     xfwd: true,
  //   }),
  // );
};
