var express = require('express');
var router = express.Router();
var ytHelper = require('../common/yptxHelper');


/* GET home page. */
router.get('/', function (req, res, next) {
    return res.render('index', { title: 'Express' });
});

module.exports = router;
