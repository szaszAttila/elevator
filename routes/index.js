var express = require('express');
var router = express.Router();

var hbs = require('express-handlebars');
const { route } = require('./command');

/* GET home page. */
router.get('/', function(req, res, next) {
  const storeys = [{ind:6},{ind:5},{ind:4},{ind:3},{ind:2},{ind:1},{ind:0}];
  const storeys_reverse = [{ind:0},{ind:1},{ind:2},{ind:3},{ind:4},{ind:5},{ind:6}];
  res.render('index', {storeys, storeys_reverse});
});

module.exports = router;
