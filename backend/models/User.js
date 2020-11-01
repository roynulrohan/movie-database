const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    Name: {
        type: String,
        required: true,
    },
    Email: {
        type: String,
        required: true,
    },
    Password: {
        type: String,
        required: true,
    },
    Date: {
        type: Date,
        default: Date.now,
    },
});
module.exports = User = mongoose.model('users', UserSchema);
