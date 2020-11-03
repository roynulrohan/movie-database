const mongoose = require('mongoose');

const UserSession = new mongoose.Schema({
    userId: {
        type: String,
        default: '',
    },
    timestamp: {
        type: Date,
        default: Date.now(),
    },
    isDeleted: {
        type: Boolean,
        default: false,
    },
    expire_at: { type: Date, default: Date.now, expires: 7200 },
});

module.exports = mongoose.model('UserSession', UserSession);
