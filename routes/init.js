'use strict';

const express = require('express');
const router = express.Router();

const init = require('../handlers/init');

function getRouter(traffic) {
  router.post('/init', init.handler(traffic));
  return router;
}


module.exports = {
  getRouter
};
