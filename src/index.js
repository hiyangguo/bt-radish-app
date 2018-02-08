import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';

import './less/index.less';

// 预先载入资源
function loadResource() {
  return new Promise((resolve) => {
    const img = new Image();
    img.src = '/api/bg';
    img.onload = () => {
      resolve();
    };
  });
}

// 初始化 APP
async function initApp() {
  try {
    await loadResource();
    ReactDOM.render(<App/>, document.getElementById('root'));
  } catch (e) {
    console.error(e);
  }
}

initApp();
