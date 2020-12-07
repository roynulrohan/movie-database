const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const Schema = mongoose.Schema;

const User = new Schema({
    Name: {
        type: String,
        default: '',
    },
    Username: {
        type: String,
        required: true,
    },
    Password: {
        type: String,
        required: true,
    },
    Type: {
        type: String,
        default: 'Regular',
    },
    Avatar: {
        type: String,
        default: '',
    },
    Saved: {
        type: Array,
        default: [],
    },
    Liked: {
        type: Array,
        default: [],
    },
    DateCreated: {
        type: Date,
        default: Date.now,
    },
});

User.methods.generateHash = function (password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

User.methods.validPassword = function (password) {
    return bcrypt.compareSync(password, this.Password);
};

module.exports = mongoose.model('User', User);
