// models/permission.js

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var PermissionSchema = new Schema({
    message_type: String,
    is_forbid: Boolean,
    update_at: { type: Date, default: Date.now }
});


module.exports = mongoose.model('permission', PermissionSchema);
