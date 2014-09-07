var express = require('express'),
    User    = require('../models/user'),
    ytHelper = require('../common/yptxHelper'),
    _ = require('underscore'),
    router  = express.Router();

// render message create page.
router.get('/create/:type', function(req, res) {
  res.render('message-create', {"type": req.params["type"]});
})

// render all message page.
router.get('/:type', function(req, res) {
  res.render('message-dashboard', {"type": req.params["type"]});
})

module.exports = router;
