const express = require('express');
const router = express.Router();

const Review = require('../models/Review');

router.route('/').get(function (req, res) {
    const { movie, source } = req.query;
    let query = {};

    if (movie) {
        query.Movie = movie;
    }

    if (source) {
        query.Source = source;
    }

    Review.find(query)
        .sort({ _id: -1 })
        .exec(function (err, reviews) {
            if (err) {
                console.log(err);
            } else {
                res.json(reviews);
            }
        });
});

router.route('/new').post(function (req, res) {
    const { movieName, movie, source, value, title, body } = req.body;

    const newReview = new Review({
        MovieName: movieName,
        Movie: movie,
        Source: source,
        Value: value,
        Title: title,
        Body: body,
    });

    newReview.save((err) => {
        if (err) {
            return res.send({
                success: false,
                message: 'Server error.',
            });
        } else {
            Review.find({
                Movie: movie,
            })
                .sort({ _id: -1 })
                .exec(function (err, reviews) {
                    if (err) {
                        return res.send({
                            success: false,
                            message: 'Server error.',
                        });
                    } else {
                        return res.send({
                            success: true,
                            updated: reviews,
                        });
                    }
                });
        }
    });
});

router.route('/delete').post(function (req, res) {
    const { id, movie } = req.body;

    console.log(req.body);
    Review.findOneAndDelete({ _id: id }).exec(function (err) {
        if (err) {
            console.log(err);
        } else {
            Review.find({
                Movie: movie,
            })
                .sort({ _id: -1 })
                .exec(function (err, reviews) {
                    if (err) {
                        return res.send({
                            success: false,
                            message: 'Server error.',
                        });
                    } else {
                        return res.send({
                            success: true,
                            updated: reviews,
                        });
                    }
                });
        }
    });
});

module.exports = router;
