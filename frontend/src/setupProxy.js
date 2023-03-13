/* eslint-disable */
const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function (app) {
  app.use(
    createProxyMiddleware('/api', {
      target: 'https://d1m7mcx00iparg.cloudfront.net/',
      changeOrigin: true,
    }),
  );
};
