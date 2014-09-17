var mongoose = require('mongoose');
var UserModel               = require('./models/user');
var ClientModel             = require('./models/client');
var AccessTokenModel        = require('./models/accessToken');
var RefreshTokenModel       = require('./models/refreshToken');
var Message = require('./models/message');

//UserModel.remove({}, function(err) {
//    var user = new UserModel({ username: "yptx", password: "yptx", is_admin: true});
//    user.save(function(err, user) {
//        if(err) return console.log(err);
//        else console.log("New user - %s:%s",user.username,user.password);
//    });
//
//    var anonymous = new UserModel({ username: "anonymous", password: "anonymous", is_admin: false});
//    anonymous.save(function(err, user) {
//        if(err) return console.log(err);
//        else console.log("New user - %s:%s",user.username,user.password);
//    });
//});
//
//ClientModel.remove({}, function(err) {
//    var client = new ClientModel({ name: "YPTX client v1", clientId: "yptx", clientSecret:"yptx" });
//    client.save(function(err, client) {
//        if(err) return console.log(err);
//        else console.log("New client - %s:%s",client.clientId,client.clientSecret);
//    });
//});
//AccessTokenModel.remove({}, function (err) {
//    if (err) return console.log(err);
//});
//RefreshTokenModel.remove({}, function (err) {
//    if (err) return console.log(err);
//});

Message.find({}, function(err, allMessage) {
    for (var i = 0; i < allMessage.length; i ++) {
        var currentMessage = allMessage[i];
        Message.findOneAndUpdate({_id: currentMessage.id}, {update_at: new Date().getTime()}, function(err, res) {
            if (err) return console.log(err);
            console.log("Update Message %d time", i);

        });
    }
});

setTimeout(function() {
    mongoose.disconnect();
}, 300000);