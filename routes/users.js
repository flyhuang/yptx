var express = require('express'),
    User = require('../models/user'),
    ytHelper = require('../common/yptxHelper'),
    _ = require('underscore'),
    router = express.Router(),
    Permission = require('../models/permission'),
    oauth2 = require('../libs/oauth2');

// redirect login page.
router.get('/', function (req, res) {
    res.redirect('login');
});

router.post('/oauth/token', oauth2.token);

// Login Page
router.get('/login', function (req, res) {
    if (req.session.user) {
        return res.redirect('/dashboard');
    }
    return res.render('login');
});

// Create User Page
router.get('/user/create', ytHelper.adminRestrict, function (req, res, next) {
    res.render('createuser');
});

// Edit User Page
router.get('/user/edit/:id', ytHelper.messageAdminRestrict, function (req, res, next) {
    var id = req.params["id"];
    User.findOne({_id: id}, function (err, user) {
        console.log(user);
        res.render('edituser', {
            "username": user.username,
            "permission_type": user.permissionType,
            "id": id,
            "disabled":user.disabled
        });
    });
});

// User List Page
router.get('/user/list', ytHelper.adminRestrict, function (req, res, next) {
    res.render('userlist')
});

router.get('/user/permission', ytHelper.adminRestrict, function (req, res, next) {
    Permission.find({}, function(err, permissions) {
        if (err) return res.json({"success" : false});
        var forbid_dict = {"realtime": false, "operation": false, "notice":false};
        for (var i = 0; i < permissions.length; i ++) {
            var permission = permissions[i];
            forbid_dict[permission.message_type] = permission.is_forbid;
        }
        return res.render('permission', {forbid_dict : forbid_dict})
    });
});

module.exports = router;
