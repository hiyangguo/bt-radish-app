const {app, BrowserWindow} = require('electron');
const devtron = require('devtron');
const path = require('path');
const {checkDevServer, initServer} = require('./server');

const {IS_DEV} = require('./server/constants');

const {SERVER_PORT = '3300'} = process.env;

// 保持一个对于 window 对象的全局引用，如果你不这样做，
// 当 JavaScript 对象被垃圾回收， window 会被自动地关闭
let win;

function createWindow() {
  // 安装拓展
  IS_DEV && installExtensions();

  // 创建浏览器窗口。
  win = new BrowserWindow({width: 1366, height: 768});

  // 然后加载应用的 index.html。
  win.loadURL(`http://localhost:${SERVER_PORT}/static`);

  // 打开开发者工具。
  win.webContents.openDevTools();

  // 当 window 被关闭，这个事件会被触发。
  win.on('closed', () => {
    // 取消引用 window 对象，如果你的应用支持多窗口的话，
    // 通常会把多个 window 对象存放在一个数组里面，
    // 与此同时，你应该删除相应的元素。
    win = null;
  });
}

function installExtensions() {
  devtron.install();
  BrowserWindow.addDevToolsExtension(path.join(__dirname, 'chrome-extensions', 'react-dev-tools'));
}

// Electron 会在初始化后并准备
// 创建浏览器窗口时，调用这个函数。
// 部分 API 在 ready 事件触发后才能使用。
app.on('ready', async function () {
  IS_DEV && checkDevServer();
  await initServer(SERVER_PORT);
  createWindow();
});

// 当全部窗口关闭时退出。
app.on('window-all-closed', () => {
  // 在 macOS 上，除非用户用 Cmd + Q 确定地退出，
  // 否则绝大部分应用及其菜单栏会保持激活。
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // 在macOS上，当单击dock图标并且没有其他窗口打开时，
  // 通常在应用程序中重新创建一个窗口。
  if (win === null) {
    createWindow();
  }
});