var express = require('express'),
    User = require('../models/user'),
    ytHelper = require('../common/yptxHelper'),
    Message = require('../models/message'),
    _ = require('underscore'),
    router = express.Router();


// Get messages
router.get('/messages/:type', function (req, res) {
    Message.find({ "type": req.params['type']}, function (error, messages) {
        if (error) return res.json({"success": false});
        var result = messages;
        if (req.query.is_admin_request) {
            var messageList = [];
            for ( var i = 0; i < messages.length; i++) {
                var message = messages[i];
                var messageResult = [];
                messageResult.push(message.title);
                messageResult.push(message.update_at);
                messageResult.push("<a onclick='getEditMsgPage(\""+ message.id + "\")'>修改</a>");
                messageResult.push("<a onclick='deleteMsg(\""+ message.id + "\")'>删除</a>");
                messageList.push(messageResult);
            }
            result = messageList;
        }
        return res.json({
            "success": true,
            "data": result
        });
    })
});

// Create messages
router.put('/messages/create/:type', function (req, res, next) {
    var title = req.body.title;
    var content = req.body.content;
    var message = new Message();
    message.title = title;
    message.content = content;
    message.type = req.params['type'];
    message.save(function (err) {
        if (err)
            res.json({"success": false, "message": "创建消息失败"});
        res.json({ "success": true });
    })
});

// Update messages
router.post('/messages/update/:id', function (req, res, next) {
    var id = req.params['id'];
    var title = req.body.title;
    var content = req.body.content;
    Message.findOneAndUpdate({_id : id}, {title:title, content:content}, function(err, message) {
        if (err)
            return res.json({"success": false, "message": "更新消息失败"});
        return res.json({ "success": true });
    });
});


// Delete messages
router.delete('/messages/delete/:messageid', function (req, res, next) {
    Message.where().findOneAndRemove({ _id: req.params["messageid"]}, function (error, callback) {
        if (error) return res.json({"success": false});
        res.json({"success" : true, "msg": "删除成功"});
    })
});


// Login API
router.post('/login', function (req, res) {
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
    var user = new User({"username": name, "password": pass});
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
router.post('/createuser', function (req, res) {
    //TODO Validation
    var user = new User(); 		// create a new instance of the Bear model
    user.username = req.body.username;  // set the bears name (comes from the request)
    user.password = ytHelper.md5(req.body.password);
    user.is_admin = req.body.is_admin;
    // save the bear and check for errors
    user.save(function (err) {
        if (err)
            res.json({"success": false, "message": "创建用户失败"});
        res.json({ "success": true });
    });
});

router.get('/logout', function (req, res) {
    ytHelper.clearCookieAndSession(res, req);
    res.send({
        success: true,
        msg: 'Logout success!'
    });
});

module.exports = router;
