// models/user.js

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UserSchema = new Schema({
    username: { type: String, index: true},
    password: String,
    avatar: String,
    update_at: { type: Date, default: Date.now },
    is_admin: Boolean,
    permission_list: Array,
    status: String
});

UserSchema.methods.findUserByName = function (cb, username) {
    return this.model('User').find({ username: username }, cb);
};

UserSchema.methods.login = function (cb) {
    return this.model('User').find({ username: this.username, password: this.password}, cb);
};

module.exports = mongoose.model('User', UserSchema);
