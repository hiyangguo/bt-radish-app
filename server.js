const express = require('express');
const proxy = require('http-proxy-middleware');
const promisify = require('util.promisify');
const {check} = require('tcp-port-used');
const {IS_DEV} = require('./server/constants');


function initServer(serverPort, initedCallback) {
  const app = express();
  // const {PORT = '3300'} = process.env;

  // 设置端口
  app.set('port', serverPort);

  // 静态页面
  // 这里一般设置你的静态资源路径
  if (IS_DEV) {
    app.use(proxy('/', {target: 'http://127.0.0.1:3301'}));
  } else {
    app.use('/', express.static('src'));
  }

  // 监听端口
  app.listen(app.get('port'), () => {
    console.log(`server running @${app.get('port')}`);
    initedCallback && initedCallback();
  });
};


function checkDevServer() {
  (async function () {
    try {
      const inUse = await check(3301, '127.0.0.1');
      if (!inUse) {
        throw new Error('Dev server is not started');
      }
    } catch (e) {
      console.warn(e.message);
    }
  })();
}

exports.checkDevServer = checkDevServer;
exports.initServer = promisify(initServer);
