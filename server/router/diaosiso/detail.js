const express = require('express');
const $ = require('cheerio');
const _ = require('lodash');
const {basename} = require('path');
const {createRequest} = require('../../util');

const router = express();


/**
 * 解析文件相关的 html
 * @param i
 * @param li
 * @return {{fileName, size}}
 */
const parsingHtmlToFileData = (i, li) => {
  const $li = $(li);
  const size = $li.find('span').text();
  // 读取 size 信息后 移除
  $li.find('span').remove();
  const fileName = $li.text();
  return {
    fileName,
    size
  };
};

router.get('/', (req, res) => {
  const hash = basename(req.baseUrl);
  (async function () {
    try {
      const response = await createRequest('www.diaosisou.org', `/torrent/${hash}`);
      const {data: body} = response;
      const $body = $.load(body);
      const title = $body('.T2').text();
      const $bootInfoPs = $body('.BotInfo p');
      // indexTime 索引日期
      const [fileSize, fileCount, createTime, indexTime, hot] = _.take(Array.from($bootInfoPs.map((i, p) => _.trim($(p).text()))), 5).map(text => /\：(.*)/.exec(text)[1]);
      const $listLis = $body('.flist li');
      const files = Array.from($listLis.map(parsingHtmlToFileData));
      res.json({
        hash,
        title,
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