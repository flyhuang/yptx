var express = require('express'),
    User = require('../models/user'),
    ytHelper = require('../common/yptxHelper'),
    Message = require('../models/message'),
    _ = require('underscore'),
    router = express.Router();

// render message create page.
router.get('/create/:type', function (req, res) {
    res.render('message-create', {"type": req.params["type"]});
});


// render message update page.
router.get('/update/:id', function (req, res) {
    var id = req.params["id"];
    Message.findOne({_id: id}, function(err, message) {
        console.log(message);
        res.render('message-create', {
            "type": message.type,
            "id": id,
            "title":message.title,
            "content": message.content
        });
    });
});

// render all message page.
router.get('/:type', function (req, res) {
    res.render('message-dashboard', {"type": req.params["type"]});
});

module.exports = router;
