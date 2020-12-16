const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Review = new Schema({
    Movie: {
        type: String,
        required: true,
    },
    MovieName: {
        type: String,
        required: true,
    },
    Source: {
        type: String,
        required: true,
    },
    Value: {
        type: String,
        required: true,
    },
    Title: {
        type: String,
        default: '',
    },
    Body: {
        type: String,
        default: '',
    },
    DateCreated: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model('Review', Review);
