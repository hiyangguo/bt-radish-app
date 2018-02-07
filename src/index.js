import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';

// 预先载入资源
function loadResource() {
  return new Promise((resolve) => {
    const img = new Image();
    img.src = 'http://api.dujin.org/bing/1920.php';
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
