var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var passport = require('passport');

var routes = require('./routes/index');
var users = require('./routes/users');
var api = require('./routes/api');
var messages = require('./routes/messages');
var adminApi = require('./routes/adminApi');

//require("./datagen");
// var redis = require('redis');

//var db = redis.createClient(port, "pub-redis-15095.us-east-1-3.1.ec2.garantiadata.com:15095");
//local
//var db = redis.createClient();


var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(require('stylus').middleware(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public')));
app.use(passport.initialize());
app.use(passport.session());

app.use(session({
    resave: false, // don't save session if unmodified
    saveUninitialized: false, // don't create session until something stored
    secret: 'yptx_srv',
    cookie: { maxAge: 60 * 60 * 6000 }
}));

app.use('/dashboard', routes);
app.use('/api', api);
app.use('/admin/api', adminApi);
app.use('/messages', messages);
app.use('/', users);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function (err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});

// Config mongoose connection
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/yptx'); // connect to our database
//mongoose.connect('mongodb://wade:wow520@kahana.mongohq.com:10045/yptx'); // connect to our database

module.exports = app;

var port = process.env.PORT || 5000; // set our port
//
// =============================================================================
app.listen(port);
console.log('Magic happens on port ' + port);
