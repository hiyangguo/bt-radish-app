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
    app.use(proxy(['/**', '!/api/**'], {target: 'http://127.0.0.1:3301', ws: true}));
  } else {
    app.use('/', express.static('build'));
  }

  // BT Book
  app.use('/api/btwhat/list', require('./server/router/btwhat/list'));
  app.use('/api/btwhat/detail/:hash', require('./server/router/btwhat/detail'));

  // 屌丝搜
  app.use('/api/diaosiso/list', require('./server/router/diaosiso/list'));
  app.use('/api/diaosiso/detail/:hash', require('./server/router/diaosiso/detail'));


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
        throw new Error('Dev server is not started , please run `npm run start-view` in your terminal');
      }
    } catch (e) {
      console.warn(e.message);
    }
  })();
}

exports.checkDevServer = checkDevServer;
exports.initServer = promisify(initServer);