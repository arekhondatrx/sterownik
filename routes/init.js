var express = require('express');
var router = express.Router();

/* GET home page. */
router.post('/init', function(req, res) {
  res.send({title: 'Express' });
});

module.exports = router;
