/* eslint-disable */
const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function (app) {
  app.use(
    createProxyMiddleware('/api', {
      target: 'https://d2ss0s7y9f899m.cloudfront.net/',
      changeOrigin: true,
    }),
  );
};
