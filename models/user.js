// models/user.js

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var crypto = require('crypto');

var UserSchema = new Schema({
    username: { type: String, required: true, unique: true },
    hashedPassword: {
        type: String,
        required: true
    },
    salt: {
        type: String,
        required: true
    },
    avatar: String,
    update_at: Number,
    permissionType: String,
    status: String,
    disabled: Boolean
});

UserSchema.methods.findUserByName = function (cb) {
    return this.model('User').find({ username: this.username }, cb);
};

UserSchema.methods.login = function (cb) {
    return this.model('User').find({ username: this.username, password: this.password}, cb);
};

UserSchema.methods.encryptPassword = function(password) {
    return crypto.createHmac('sha1', this.salt).update(password).digest('hex');
    //more secure - return crypto.pbkdf2Sync(password, this.salt, 10000, 512);
};

UserSchema.virtual('userId')
    .get(function () {
        return this.id;
    });

UserSchema.virtual('password')
    .set(function(password) {
        this._plainPassword = password;
        this.salt = crypto.randomBytes(32).toString('base64');
        //more secure - this.salt = crypto.randomBytes(128).toString('base64');
        this.hashedPassword = this.encryptPassword(password);
    })
    .get(function() { return this._plainPassword; });


UserSchema.methods.checkPassword = function(password) {
    return this.encryptPassword(password) === this.hashedPassword;
};

module.exports = mongoose.model('User', UserSchema);
