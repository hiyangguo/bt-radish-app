import $ from 'cheerio';
import _ from 'lodash';
import evalScript from '../../utils/evalScript';


/**
 * 解析搜索状态相关的文字
 * @param searchStatus
 * @return {{total: string, spending: null}}
 */
const parsingSearchStatusTextToData = (searchStatus) => {
  const total = _.trim(/找到约 (\d+)/.exec(searchStatus)[1]);
  return {
    total,
    spending: null
  };
};

/**
 * 解析详情相关的 html
 * @param i
 * @param item
 * @return {{hash: string, title, createTime: any, fileSize: any, fileCount: any, hot: any}}
 */
const parsingHtmlToItemData = (i, item) => {
  const $item = $(item);
  const $title = $item.find('[name="file_title"]');

  const hash = /\/(\w+)$/.exec($title.attr('href'))[1];
  const title = $title.text();

  const [fileSize, fileCount, createTime, hot] = Array.from($item.find('.BotInfo span').map((i, span) => _.trim($(span).text())));

  return {
    hash,
    title,
    createTime,
    fileSize,
    fileCount,
    hot
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
  const matchingResults = /\/list\/(.*)/.exec($a.attr('href')) || [];
  const query = matchingResults[1] || null;
  return {
    num,
    query
  };
};

const parserList = (resp) => {
  try {
    const body = _.get(resp, 'data') || '';
    const $body = $.load(body);
    const $container = $body('#container');
    const searchStatus = parsingSearchStatusTextToData($container.find('.main .rststat').text());
    const $items = $body('.mlist li');
    const items = Array.from($items.map(parsingHtmlToItemData));
    const $pager = $body('#mpages .pg .pg');
    const $pages = $pager.children();
    const current = $pager.find('span').text();
    const pages = Array.from($pages.map(parsingHtmlToPageData));
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
