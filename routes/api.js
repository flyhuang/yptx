var express = require('express'),
    User    = require('../models/user'),
    ytHelper = require('../common/yptxHelper'),
    Message = require('../models/message'),
    _ = require('underscore'),
    router  = express.Router();


// Get messages
router.get('/messages/:type', function(req, res) {
  Message.find({ "type": req.params['type']}, function(error, messages) {
    if (error) return res.json({"success": false});
    return res.json({
      "success" : true,
      "messages": messages
    });
  })
})

// Create messages
router.put('/messages/create/:type', function(req, res, next) {
  var title = req.body.title;
  var content = req.body.content;
  var message = new Message();
  message.title = title;
  message.content = content;
  message.type = req.params['type'];
  message.save(function(err) {
    if (err)
      res.json({"success": false, "message": "创建消息失败"});
    res.json({ "success" : true });
  })
})

// Update messages


// Delete messages


// Login API
router.post('/login', function(req, res) {
      console.log("Rquest to login");
      var name = req.body.username;
      var pass = req.body.password;
      if (_.isEmpty(name) || _.isEmpty(pass)) {
          res.json({
              success: false,
              msg: '请输入正确的用户名或者密码',
              name: name,
              pass: pass
          });
      }
      pass = ytHelper.md5(pass);
      var user = new User( {"username": name, "password": pass});
      user.login(function (err, userDetails) {
          if (err)
              res.send(err);
          console.log(userDetails);
          ytHelper.popSession(userDetails, res, req);
          if (!userDetails) {
            return res.json({
              success: false,
              msg: "请输入正确的用户名或者密码"
            })
          }
          return res.json({
              success: true,
              user: userDetails
          });
      });
});


//Create user api
router.post('/createuser', function(req, res) {
    //TODO Validation
    var user = new User(); 		// create a new instance of the Bear model
    user.username = req.body.username;  // set the bears name (comes from the request)
    user.password = ytHelper.md5(req.body.password);
    user.is_admin = req.body.is_admin;
    // save the bear and check for errors
    user.save(function(err) {
      if (err)
        res.json({"success": false, "message": "创建用户失败"});
      res.json({ "success" : true });
    });
});

router.get('/logout', function(req, res) {
    ytHelper.clearCookieAndSession(res, req);
    res.send({
        success: true,
        msg: 'Logout success!'
    });
})

module.exports = router;
