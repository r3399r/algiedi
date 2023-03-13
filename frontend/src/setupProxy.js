/* eslint-disable */
const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function (app) {
  app.use(
    createProxyMiddleware('/api', {
      target: 'https://d2damo2n185tp4.cloudfront.net/',
      changeOrigin: true,
    }),
  );
};
