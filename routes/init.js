'use strict';

const express = require('express');
const router = express.Router();

router.post('/init', function(req, res) {
  res.send({title: 'Express' });
});

module.exports = router;
