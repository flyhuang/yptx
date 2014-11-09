require('mongoose-pagination');
require('../libs/auth');

var express = require('express'),
    User = require('../models/user'),
    ytHelper = require('../common/yptxHelper'),
    Message = require('../models/message'),
    _ = require('underscore'),
    Permission = require('../models/permission'),
    router = express.Router(),
    JPush = require("jpush-sdk"),
    passport = require('passport'),
    oauth2 = require('../libs/oauth2');

var client = JPush.buildClient('a13e1db90e37e020e545d540', 'da08e43c8d6aff997ffe79bd');


router.get('/', passport.authenticate('bearer', { session: false }), function (req, res) {
    res.send('API is running');
});

// Get messages
router.get('/messages/:type', [passport.authenticate('bearer', { session: false }), ytHelper.checkPermission], function (req, res) {
    var page = req.query.page ? req.query.page : 1;
    var count = req.query.count ? req.query.count : 10;
    var is_lasted = req.query.is_lasted ? req.query.is_lasted : false;
    var currentTime = req.query.currentDate ? req.query.currentDate : new Date().getTime();
    console.log(currentTime);
    var query = {};
    if (is_lasted) {
        query = { "type": req.params['type'], "update_at": {"$gt": currentTime}};
    } else {
        query = { "type": req.params['type'], "update_at": {"$lt": currentTime}};
    }
    Message.find(query, 'type content title update_at', {sort: {update_at: -1}}).paginate(page, count, function (error, messages, total) {
        if (error) return res.json({"success": false});
        return res.json({
            "success": true,
            "data": messages
        });
    })
});

router.get('/message/:type/:id/', [passport.authenticate('bearer', { session: false }) , ytHelper.checkPermission], function (req, res, next) {
    var id = req.params["id"];
    var type = req.params["type"];
    Message.findOne({_id: id, type: type}, 'type content title update_at', function (err, message) {
        if (err) return res.json({"success": false});
        return res.json({
            "success": true,
            "data": message
        });
    });
});

router.get('/logout', passport.authenticate('bearer', { session: false }), function (req, res) {
    ytHelper.clearCookieAndSession(res, req);
    res.send({
        success: true,
        msg: 'Logout success!'
    });
});

router.post('/user/changepassword/', passport.authenticate('bearer', { session: false }), function (req, res) {
    var authInfo = req.authInfo;
    var id = authInfo['userId'];
    var old_password = req.body.oldPassword;
    var new_password = req.body.newPassword;
    if (_.isEmpty(new_password)) {
        return res.json({"success": false, "msg": "新密码不能为空"});
    }
    User.findOne({_id: id}, function (err, user) {
        if (err || !user) return res.json({"success": false, "msg": "更新用户信息失败"});
        if (!user.checkPassword(old_password)) {
            return res.json({"success": false, "msg": "密码不正确"});
        }
        user.password = new_password;
        user.save(function (err) {
            if (err)
                return res.json({"success": false, "message": "修改密码失败"});
            return res.json({ "success": true, "msg": "密码更新成功" });
        });
    })
});

router.get('/permission', function (req, res) {
    Permission.find({}, function (err, permissions) {
        if (err) return res.json({"success": false});
        var forbid_dict = {"realtime": false, "operation": false, "notice": false};
        for (var i = 0; i < permissions.length; i++) {
            var permission = permissions[i];
            if (permission.message_type != undefined) {
                forbid_dict[permission.message_type] = permission.is_forbid;
            }
        }
        return res.json({forbid_dict: forbid_dict, success: true})
    });
});

module.exports = router;
