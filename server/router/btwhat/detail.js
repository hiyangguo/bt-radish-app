const express = require('express');
const $ = require('cheerio');
const _ = require('lodash');
const {basename} = require('path');
const {createRequest, evalScript} = require('../../util');

const router = express();


/**
 * 解析文件相关的 html
 * @param i
 * @param li
 * @return {{fileName, size}}
 */
const parsingHtmlToFileData = (i, li) => {
  const $li = $(li);
  const size = $li.find('.cpill').text();
  const fileName = $.load(evalScript($li.find('script').html())).text();
  return {
    fileName,
    size
  };
};

router.get('/', (req, res) => {
  const hash = basename(req.baseUrl);
  (async function () {
    try {
      const response = await createRequest('www.btwhat.info', `/wiki/${hash}.html`);
      const {data: body} = response;
      const $body = $.load(body);
      const $wall = $body('#wall');
      const title = evalScript($wall.find('h2 script').html());
      const $tds = $wall.find('.detail-table tr:nth-child(2) td');
      const $listLis = $wall.find('.detail-panel ol li');
      const [fileType, createTime, hot, fileSize, fileCount] = Array.from($tds.map((i, item) => _.trim($(item).text())));
      const files = Array.from($listLis.map(parsingHtmlToFileData));
      res.json({
        hash,
        title,
        fileType,
        createTime,
        hot,
        fileSize,
        fileCount,
        files,
        magnet: `magnet:?xt=urn:btih:${hash}`
      });
    } catch (e) {
      console.warn(e);
      res.json({});
    }
  })();
});

module.exports = router;