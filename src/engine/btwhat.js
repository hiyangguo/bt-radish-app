import path from 'path';
import $ from 'cheerio';
import _ from 'lodash';
import evalScript from '../utils/evalScript';

/**
 * 解析文件相关的 html
 * @param i
 * @param li
 * @return {{fileName, size}}
 */
const parsingHtmlToFileData = (i, li) => {
  const $li = $(li);
  const size = $li.find('.lightColor').text();
  const fileName = $.load(evalScript($li.find('script').html())).text();
  return {
    fileName,
    size
  };
};

/**
 * 解析详情相关的 html
 * @param i
 * @param item
 * @return {{hash: string, title, fileType, createTime: any, fileSize: any, hot: any, lastDownload: any, files: any[]}}
 */
const parsingHtmlToItemData = (i, item) => {
  const $item = $(item);
  const $title = $item.find('.item-title a');
  const $listLis = $item.find('.item-list li');
  const $itemBar = $item.find('.item-bar');
  const hash = path.basename($title.attr('href'), '.html');
  const title = $.load(evalScript($title.find('script').html())).text();
  const fileType = $itemBar.find('span.cpill').text();
  const [createTime, fileSize, hot, lastDownload] = Array.from($itemBar.find('span b').map((i, item) => $(item).text()));
  const files = Array.from($listLis.map(parsingHtmlToFileData));
  return {
    hash,
    title,
    fileType,
    createTime,
    fileSize,
    hot,
    lastDownload,
    files
  };
};

/**
 * 解析分页相关的 html
 * @param i
 * @param a
 * @return {{num: *, query: string}}
 */
const parsingHtmlToPageData = (i, a) => {
  const $a = $(a);
  const num = _.trim($a.text());
  const matchingResults = /\/search\/(.*)\.html/.exec($a.attr('href')) || [];
  const query = matchingResults[1] || null;
  return {
    num,
    query
  };
};

/**
 * 解析搜索状态相关的文字
 * @param searchStatus
 * @return {{total: string, spending: string}}
 */
const parsingSearchStatusTextToData = (searchStatus) => {
  const total = _.trim(/About (\d+)/.exec(searchStatus)[1]);
  const spending = _.trim(/in(.*)\./.exec(searchStatus)[1]);
  return {
    total,
    spending
  };
};

const parserList = (resp) => {
  try {
    const body = _.get(resp, 'data') || '';
    const $body = $.load(body);
    const $wall = $body('#wall');
    const $items = $wall.find('.search-item');
    const $bottomPager = $wall.find('.bottom-pager');
    const $pages = $bottomPager.children();
    const current = $bottomPager.find('span').text();
    const items = Array.from($items.map(parsingHtmlToItemData));
    const pages = Array.from($pages.map(parsingHtmlToPageData));
    const searchStatus = parsingSearchStatusTextToData($wall.find('.search-statu span').text());

    return {
      code: 200000,
      data: {
        searchStatus,
        items
      },
      page: {
        current,
        pages
      }
    };
  } catch (e) {
    console.warn(e);
    return {
      code: 200500,
    };
  }
};

export default parserList;
