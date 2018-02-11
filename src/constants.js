import createConstants from './utils/createConstants';

// 支持的网站列表
export const SUPPORT_WEBS = {
  btwhat: {
    name: 'BT Book',
    icon: 'btbook.ico'
  },
  diaosiso: {
    name: '屌丝搜',
    icon: 'diaosiso.png'
  }
};

/**
 * 按键 CODE
 * @type {{Enter: number}}
 */
export const KeyCodes = {
  //回车
  Enter: 13
};

/**
 * 响应码
 * @type {{ERROR,REQUEST, SUCCESS}}
 */
export const ResponseStatus = createConstants(
  'REQUEST',
  'SUCCESS',
  'ERROR'
);