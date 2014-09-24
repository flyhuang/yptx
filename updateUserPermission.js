var mongoose = require('mongoose');
var UserModel = require('./models/user');

mongoose.connect('mongodb://localhost:27017/yptx');

executeFunc(102490001, 102490999);

function executeFunc(currentUserNum, num){
    if (currentUserNum > 102490999) return;
    var query = {disabled: true};
    UserModel.findOneAndUpdate({username: currentUserNum}, query, function(err, res) {
        if (err || !res) {
            console.log("No username %s or update failed", currentUserNum);
        } else {
            console.log("update username : %s success!", currentUserNum);
        }
        executeFunc(currentUserNum + 1, num);
    });
}

setTimeout(function() {
    mongoose.disconnect();
}, 10000);