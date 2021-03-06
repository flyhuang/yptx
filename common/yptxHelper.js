/**
 * YPTX common helpers
 *
 * @author wade.huang
 */

"use strict";

// YPTX Helper.
// --------------

var crypto = require('crypto'),
    config = require('../conf/yptx-conf').config,
    _ = require('underscore');

var yptxHelper = function yptxHelper() {
};

_.extend(yptxHelper.prototype, {

    // Populate user session and cookies. By following attributes:
    // `user._id`
    // `user.name`
    // `user.pass`
    // `user.email`.
    popSession: function (user, res, req) {
        if (user) {
            // req.session.regenerate(function(){
            //   // Store the user's primry key
            //   // in the session store to be retrieved,
            //   // or in this case the entire user object
            //   req.session.user = user;
            // });
            req.session.user = user;
            req.session.save();
        }
        //cookie valid in 30 days.
        var authToken = this.genAuthToken(user);
        return res.cookie(config.auth_cookie_name, authToken, {
            path: '/',
            maxAge: 1000 * 60 * 60 * 24 * 30
        });
    },

    // Generate authentication token.
    genAuthToken: function (user) {
        return this.encrypt(user._id + '\t' + user.name + '\t' + user.password, config.session_secret);
    },

    // Clear http response cookies.
    clearCookieAndSession: function (res, req) {
        req.session.destroy(function () {
            //res.redirect('/');
        });
        res.clearCookie(config.auth_cookie_name, {
            path: '/'
        });
    },

    // Encrypt string with AES192.
    encrypt: function (str, secret) {
        var cipher = crypto.createCipher('aes192', secret);
        var enc = cipher.update(str, 'utf8', 'hex');
        enc += cipher.final('hex');
        return enc;
    },

    // Decrypt string with AES192.
    decrypt: function (str, secret) {
        var decipher = crypto.createDecipher('aes192', secret);
        var dec = decipher.update(str, 'hex', 'utf8');
        dec += decipher.final('utf8');
        return dec;
    },

    // Encrypt string with MD5.
    md5: function (str) {
        var md5sum = crypto.createHash('md5');
        md5sum.update(str);
        str = md5sum.digest('hex');
        return str;
    },

    // Generate random string.
    randomString: function (size) {
        size = size || 6;
        var code_string = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        var max_num = code_string.length + 1;
        var new_pass = '';
        while (size > 0) {
            new_pass += code_string.charAt(Math.floor(Math.random() * max_num));
            size--;
        }
        return new_pass;
    },

    adminRestrict: function (req, res, next) {
        console.log(req.session);
        if (req.session.user) {
            if (req.session.user.permissionType != 'admin') {
                return res.json({"success": false, msg: "没有权限操作, 请联系管理员!"});
            }
            res.locals.session = req.session;
            return next();
        } else {
            req.session.error = 'Access denied!';
            if (req.xhr) {
                return res.status('403').json({success:false, msg: "Access denied!"});
            }
            return res.redirect('/login?expired=true');
        }
    },

    messageAdminRestrict: function (req, res, next) {
        console.log(req.session);
        if (req.session.user && (req.session.user.permissionType == 'admin' || req.session.user.permissionType == 'message_admin')) {
            res.locals.session = req.session;
            return next();
        } else {
            req.session.error = 'Access denied!';
            if (req.xhr) {
                return res.status('403').json({success:false, msg: "Access denied!"});
            }
            return res.redirect('/login?expired=true');
        }
    },

    userRestrict: function (req, res, next) {
        if (req.session.user ) {
            if (req.session.user.permissionType == 'admin') {
                res.locals.session = req.session;
                return next();
            } else if (req.session.user.permissionType == 'message_admin') {
                if (req.session.user._id != req.params["id"]) {
                    return res.json({"success": false, "msg": "没有权限修改!"});
                }
                return next();
            } else {
                req.session.error = 'Access denied!';
                if (req.xhr) {
                    return res.status('403').json({success:false, msg: "Access denied!"});
                }
                return res.redirect('/login?expired=true');
            }
        } else {
            req.session.error = 'Access denied!';
            if (req.xhr) {
                return res.status('403').json({success:false, msg: "Access denied!"});
            }
            return res.redirect('/login?expired=true');
        }
    },

    addAccessTokenIntoSession: function (req, res, next) {
        var accessToken = req.body.access_token;
        var refreshToken = req.body.refresh_token;
        console.log(accessToken);
        if (accessToken) {
            req.session.accessToken = accessToken;
        }

        if (refreshToken) {
            req.session.refreshToken = refreshToken;
        }

        req.session.save();
    },

    checkPermission: function (req, res, next) {
        var authInfo = req.authInfo;
        var scope = authInfo.scope;
        if (scope == "*") {
            return next();
        } else {
            var messageType = req.params["type"];
            if (messageType) {
                if (scope[messageType]) {
                    return res.status(403).send("没有权限!");
                }
            }
            return next();
        }
    }
});

module.exports = new yptxHelper();
