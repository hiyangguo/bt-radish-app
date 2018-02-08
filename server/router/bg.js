const express = require('express');
const {createRequest} = require('../util');
const _ = require('lodash');

const router = express();

const host = 'www.bing.com';

router.get('/', (req, res) => {
  (async function () {
    try {
      const response = await createRequest(host, '/HPImageArchive.aspx?format=js&idx=0&n=1');
      const url = _.get(response, 'data.images[0].url');
      res.redirect(301, `http://${host}${url}`);
    } catch (e) {
      console.log(e);
      res.redirect('http://via.placeholder.com/1366x768?text=Error');
    }
  })();
});

module.exports = router;