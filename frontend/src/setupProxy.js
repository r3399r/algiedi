/* eslint-disable */
const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function (app) {
  app.use(
    createProxyMiddleware('/api', {
      target: 'https://d3caxkxjy74gqp.cloudfront.net/',
      changeOrigin: true,
    }),
  );
};
