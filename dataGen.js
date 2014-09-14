var mongoose = require('mongoose');
var UserModel               = require('./models/user');
var ClientModel             = require('./models/client');
var AccessTokenModel        = require('./models/accessToken');
var RefreshTokenModel       = require('./models/refreshToken');

UserModel.remove({}, function(err) {
    var user = new UserModel({ username: "yptx", password: "yptx" });
    user.save(function(err, user) {
        if(err) return console.log(err);
        else console.log("New user - %s:%s",user.username,user.password);
    });
});

ClientModel.remove({}, function(err) {
    var client = new ClientModel({ name: "YPTX client v1", clientId: "yptx", clientSecret:"yptx" });
    client.save(function(err, client) {
        if(err) return console.log(err);
        else console.log("New client - %s:%s",client.clientId,client.clientSecret);
    });
});
AccessTokenModel.remove({}, function (err) {
    if (err) return console.log(err);
});
RefreshTokenModel.remove({}, function (err) {
    if (err) return console.log(err);
});

setTimeout(function() {
    mongoose.disconnect();
}, 3000);