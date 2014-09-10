var express = require('express'),
    User = require('../models/user'),
    ytHelper = require('../common/yptxHelper'),
    _ = require('underscore'),
    router = express.Router();

// redirect login page.
router.get('/', function (req, res) {
    res.redirect('login');
});

// Login Page
router.get('/login', function (req, res) {
    res.render('login');
});

// Create User Page
router.get('/user/create', function (req, res, next) {
    res.render('createuser');
});

// Edit User Page
router.get('/user/edit/:id', function (req, res, next) {
    var id = req.params["id"];
    User.findOne({_id: id}, function (err, user) {
        console.log(user);
        res.render('edituser', {
            "username": user.username,
            "is_admin": user.is_admin,
            "id": id
        });
    });
});

// User List Page
router.get('/user/list', function (req, res, next) {
    res.render('userlist')
});

module.exports = router;
