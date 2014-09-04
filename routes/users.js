var express = require('express'),
    User    = require('../models/user'),
    ytHelper = require('../common/yptxHelper'),
    _ = require('underscore'),
    router  = express.Router();

/* GET users listing. */
router.get('/', function(req, res) {
  User.find(function(err, users) {
      if (err)
        res.send(err);
      res.json  (users);
  });
});

// Login Page
router.get('/login', function(req, res) {
  res.render('login');
})

// Register Page
router.get('/register', function(req, res) {
  res.render('register');
})

// Signup API

// Login API
router.post('/login', function(req, res) {
        var name = req.body.username;
        var pass = req.body.password;
        if (_.isEmpty(name) || _.isEmpty(pass)) {
            res.json({
                success: false,
                msg: 'Invalid username or password!',
                name: name,
                pass: pass
            });
        }
        pass = ytHelper.md5(pass);
        var user = new User( {"username": name, "password": pass});
        user.login(function (err, userDetails) {
            if (err)
                res.send(err);
            ytHelper.popSession(user, res);
            res.json({
                success: true,
                user: userDetails
            });
        });
});

router.post('/register', function(req, res) {
    var user = new User(); 		// create a new instance of the Bear model
		user.username = req.body.username;  // set the bears name (comes from the request)
    user.password = ytHelper.md5(req.body.password);
		// save the bear and check for errors
		user.save(function(err) {
			if (err)
				res.send(err);
			res.json({ message: 'User created!' });
		});

});

router.get('/logout', function(req, res) {
    //req.session.destroy();
    hsHelper.clearCookie(res);
    res.send({
        success: true,
        msg: 'Logout success!'
    });
})

module.exports = router;
