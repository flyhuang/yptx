var passport                = require('passport');
var BasicStrategy           = require('passport-http').BasicStrategy;
var ClientPasswordStrategy  = require('passport-oauth2-client-password').Strategy;
var BearerStrategy          = require('passport-http-bearer').Strategy;
var UserModel               = require('../models/user');
var ClientModel             = require('../models/client');
var AccessTokenModel        = require('../models/accessToken');
var RefreshTokenModel       = require('../models/refreshToken');
var Permission              = require('../models/permission');

passport.use(new BasicStrategy(
    function(username, password, done) {
        ClientModel.findOne({ clientId: username }, function(err, client) {
            if (err) { return done(err); }
            if (!client) { return done(null, false); }
            if (client.clientSecret != password) { return done(null, false); }

            return done(null, client);
        });
    }
));

passport.use(new ClientPasswordStrategy(
    function(clientId, clientSecret, done) {
        ClientModel.findOne({ clientId: clientId }, function(err, client) {
            if (err) { return done(err); }
            if (!client) { return done(null, false); }
            if (client.clientSecret != clientSecret) { return done(null, false); }

            return done(null, client);
        });
    }
));

passport.use(new BearerStrategy(
    function(accessToken, done) {
        AccessTokenModel.findOne({ token: accessToken }, function(err, token) {
            if (err) { return done(err); }
            if (!token) { return done(null, false); }
            console.log("#################### Access Token: ####################");
            console.log(accessToken);
            console.log("#################### Current Token ####################");
            console.log(token.created);
            if( Math.round((Date.now()-token.created)/1000) > 3600 ) {
                AccessTokenModel.remove({ token: accessToken }, function (err) {
                    if (err) return done(err);
                });
                return done(null, false, { message: 'Token expired' });
            } else {
                AccessTokenModel.findOneAndUpdate({ token: accessToken }, {created: Date.now}, function (err) {
                    if (err) return done(err);
                    UserModel.findById(token.userId, function(err, user) {
                        if (err) { return done(err); }
                        if (!user) { return done(null, false, { message: 'Unknown user' }); }
                        var info = { scope: '*', userId: user.id };

                        if (user.username == "anonymous" || user.disabled) {
                            Permission.find({}, function (err, permissions) {
                                if (err) return done(err);
                                var forbid_dict = {"realtime": false, "operation": false, "notice": false};
                                for (var i = 0; i < permissions.length; i++) {
                                    var permission = permissions[i];
                                    if (permission.message_type != undefined) {
                                        forbid_dict[permission.message_type] = permission.is_forbid;
                                    }
                                }
                                info['scope'] = forbid_dict;
                                done(null, user, info);
                            });
                        } else {
                            done(null, user, info);
                        }

                    });
                })
            }


        });
    }
));