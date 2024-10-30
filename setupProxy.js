const { createProxyMiddleware } = require('http-proxy-middleware');

const BACKEND_HOST = "https://estate-mart-backend.onrender.com" 
// const BACKEND_PORT = process.env.BACKEND_PORT || 8080;
// || 'http://localhost:8080';

module.exports = function(app) {

  app.use(
    '/',
    createProxyMiddleware({
      target: target,
      changeOrigin: true,
      logLevel: 'debug'
    })
  );

  /**
  *   You can create other proxies using app.use() method.
  */
};
