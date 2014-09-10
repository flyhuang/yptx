require('mongoose-pagination');
var express = require('express'),
    User = require('../models/user'),
    ytHelper = require('../common/yptxHelper'),
    Message = require('../models/message'),
    _ = require('underscore'),
    router = express.Router();


// Get messages
router.get('/messages/:type', function (req, res) {
    if (req.query.is_admin_request) {
        Message.find({ "type": req.params['type']}, function (error, messages) {
            if (error) return res.json({"success": false});
            var messageList = [];
            for (var i = 0; i < messages.length; i++) {
                var message = messages[i];
                var messageResult = [];
                messageResult.push(message.title);
                messageResult.push(message.update_at);
                messageResult.push("<a onclick='getEditMsgPage(\"" + message.id + "\")'>修改</a>");
                messageResult.push("<a onclick='deleteMsg(\"" + message.id + "\")'>删除</a>");
                messageList.push(messageResult);
            }
            return res.json({
                "success": true,
                "data": messageList
            });
        })
    } else {
        var page  = req.query.page ? req.query.page : 1;
        var count = req.query.count ? req.query.count : 10;
        var is_lasted = req.query.is_lasted ? req.query.is_lasted : false;
        var currentTime = req.query.currentDate ? req.query.currentDate : new Date();
        console.log(currentTime);
        var query = {};
        if (is_lasted) {
            query = { "type": req.params['type'], "update_at": {"$gte": currentTime}};
        } else {
            query = { "type": req.params['type'], "update_at": {"$lte": currentTime}};
        }
        Message.find(query, null, {sort: {update_at: -1}}).paginate(page, count, function (error, messages, total) {
            if (error) return res.json({"success": false});
            return res.json({
                "success": true,
                "data": messages,
                "total": total,
                "page": page,
                "count": messages.length
            });
        })
    }
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
    Message.findOneAndUpdate({_id: id}, {title: title, content: content}, function (err, message) {
        if (err)
            return res.json({"success": false, "message": "更新消息失败"});
        return res.json({ "success": true });
    });
});


// Delete messages
router.delete('/messages/delete/:messageid', function (req, res, next) {
    Message.where().findOneAndRemove({ _id: req.params["messageid"]}, function (error, callback) {
        if (error) return res.json({"success": false});
        res.json({"success": true, "msg": "删除成功"});
    })
});


// Login API
router.post('/login', function (req, res) {
    console.log("Rquest to login");
    var name = req.body.username;
    var pass = req.body.password;
    var isAdmin = req.body.is_admin;
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
        if (userDetails.length <= 0) {
            return res.json({
                success: false,
                msg: "请输入正确的用户名或者密码"
            })
        }
        if (isAdmin) {
            if (!userDetails.is_admin) {
                return res.json({
                    success: false,
                    msg: "没有权限登陆, 请联系管理员!"
                })
            }
        }
        ytHelper.popSession(userDetails, res, req);
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


router.get('/user/list', function (req, res) {
    User.find({}).sort('-update_at').exec(function(err, userList) {
        if (err)
            res.json({"success": false, "message": "查询用户失败"});
        var resList = [];
        for (var i = 0; i < userList.length; i++) {
            var user = userList[i];
            var userResult = [];
            userResult.push(user.username);
            userResult.push(user.update_at);
            userResult.push("<a onclick='getEditUserPage(\"" + user.id + "\")'>修改</a>");
            userResult.push("<a onclick='deleteUser(\"" + user.id + "\")'>删除</a>");
            if (user.status == 'online') {
                userResult.push("在线");
            } else if (user.status == 'offline') {
                userResult.push("离线");
            } else {
                userResult.push("未知");
            }
            userResult.push(user.is_admin);
            resList.push(userResult);
        }
        return res.json({
            "success": true,
            "data": resList
        });
    });
});

router.delete('/delete/user/:id', function(req, res){
    User.where().findOneAndRemove({ _id: req.params["id"]}, function (error, callback) {
        if (error) return res.json({"success": false});
        res.json({"success": true, "msg": "删除成功"});
    });
});

router.post('/update/user/:id', function(req, res) {
    var id = req.params['id'];
    var password = ytHelper.md5(req.body.password);
    var is_admin = req.body.is_admin;
    User.findOneAndUpdate({_id: id}, {password: password, is_admin: is_admin}, function (err, user) {
        if (err)
            return res.json({"success": false, "msg": "更新用户信息失败"});
        return res.json({ "success": true });
    });
});

router.post('/user/changepassword/:id', function (req, res) {
    var id = req.params['id'];
    var old_password = req.body.oldPassword;
    var new_password = req.body.newPassword;
    if (_.isEmpty(new_password)) {
        return res.json({"success": false, "msg": "新密码不能为空"});
    }
    User.find({_id: id}, function(err, user) {
        if (err) return res.json({"success": false, "msg": "更新用户信息失败"});
        if (user.password != ytHelper.md5(old_password)) {
            return res.json({"success": false, "msg": "密码不正确"});
        }
        user.password = ytHelper.md5(new_password);
        user.save(function (err) {
            if (err)
                return res.json({"success": false, "message": "修改密码失败"});
            return res.json({ "success": true, "msg": "密码更新成功" });
        });
    })
});

module.exports = router;
