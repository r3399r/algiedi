/* eslint-disable */
const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function (app) {
  app.use(
    createProxyMiddleware('/api', {
      target: 'https://d6sxiz9z2i2n.cloudfront.net/',
      changeOrigin: true,
    }),
  );
};
