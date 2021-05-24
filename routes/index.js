var express = require('express');
var router = express.Router();



router.use("/admin",require(__dirname + "/admin"));
router.use("/blog",require(__dirname + "/blog"));
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});
router.get('/test', function(req, res, next) {
  res.render('test', { title: 'Express' });
});

router.get('/chat', function(req, res, next) {
  res.render('chat', { title: 'chat' });
});
module.exports = router;
