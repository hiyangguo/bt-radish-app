const express = require('express');
const path = require('path');
const $ = require('cheerio');
const _ = require('lodash');
const {createRequest, evalScript} = require('../../util');

const router = express();

// 解析文件相关的 html
const parsingHtmlToFileData = (i, li) => {
  const $li = $(li);
  const size = $li.find('.lightColor').text();
  const fileName = $.load(evalScript($li.find('script').html())).text();
  return {
    fileName,
    size
  };
};

// 解析详情先关的 html
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

// 解析 分页 相关的 html
const parsingHtmlToPageData = (i, a) => {
  const $a = $(a);
  const num = $a.text();
  const query = /\/search\/(.*)\.html/.exec($a.attr('href'))[1];
  return {
    num,
    query
  };
};

// 解析搜索状态相关的文字
const parsingSearchStatusTextToData = (searchStatus) => {
  const total = _.trim(/About (\d+)/.exec(searchStatus)[1]);
  const spending = _.trim(/in(.*)\./.exec(searchStatus)[1]);
  return {
    total,
    spending
  };
};

router.get('/', (req, res) => {
  // 接受 path 参数进行分页查询
  const path = _.get(req, 'query.path') || null;
  // 或者使用 word 参数查询第一页数据
  const word = encodeURIComponent(_.get(req, 'query.word'));
  (async function () {
    try {
      const response = await createRequest('www.btwhat.info', `/search/${path || word}.html`);
      const {data: body} = response;
      const $body = $.load(body);
      const $wall = $body('#wall');
      const $items = $wall.find('.search-item');
      const $bottomPager = $wall.find('.bottom-pager');
      const $pages = $bottomPager.find('a');
      const current = $bottomPager.find('span').text();
      const items = Array.from($items.map(parsingHtmlToItemData));
      const pages = Array.from($pages.map(parsingHtmlToPageData));
      const searchStatus = parsingSearchStatusTextToData($wall.find('.search-statu span').text());
      res.json({
        data: {
          searchStatus,
          items
        },
        page: {
          current,
          pages
        }
      });
    } catch (e) {
      console.warn(e);
      res.json({});
    }
  })();
});

module.exports = router;