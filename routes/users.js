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
    res.render('createuser', {'active': 'createUser'});
});

module.exports = router;
