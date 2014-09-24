var mongoose = require('mongoose');
var UserModel = require('./models/user');

mongoose.connect('mongodb://localhost:27017/yptx');

executeFunc(102490001, 102490999);

function executeFunc(currentUserNum, num){
    if (currentUserNum > 102490999) return;
    UserModel.findOne({username: currentUserNum}, function(err, res) {
        if (err || !res) {
            var user = new UserModel({ username: currentUserNum, password: "111111", permissionType: "normal_user", disabled:true});
            user.save(function(err, user) {
                if(err) console.log(err);
                else console.log("New user - %s:%s",user.username,user.password);
                executeFunc(currentUserNum + 1, num);
            });
        } else {
            console.log("username : %s exist!", currentUserNum);
            executeFunc(currentUserNum + 1, num);
        }

    });
}

setTimeout(function() {
    mongoose.disconnect();
}, 10000);