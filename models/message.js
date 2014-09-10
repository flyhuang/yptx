// models/message.js

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var MessageSchema = new Schema({
    type: String,
    content: String,
    title: String,
    update_at: { type: Date, default: Date.now }
});


module.exports = mongoose.model('Message', MessageSchema);
