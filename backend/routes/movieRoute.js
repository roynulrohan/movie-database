const express = require('express');
const router = express.Router();

const Movie = require('../models/Movie');

// middleware to lowercase query params for case insensitive matching
router.use(function (req, res, next) {
    for (var key in req.query) {
        req.query[key.toLowerCase()] = req.query[key];
    }
    next();
});

router.route('/').get(function (req, res) {
    const { title, genre, year, minRating, actor } = req.query;
    let query = {};

    if (title) {
        query.Title = title;
    }

    if (genre) {
        query.Genre = { $regex: genre, $options: 'i' };
    }

    if (year) {
        query.Year = year;
    }

    if (actor) {
        query.Actors = { $regex: actor, $options: 'i' };
    }

    console.log(query);
    Movie.aggregate([{ $match: query }, { $sample: { size: 30 } }], function (
        err,
        movies
    ) {
        if (err) {
            console.log(err);
        } else {
            res.json(movies);
        }
    });
});

router.route('/:id').get(function (req, res) {
    let id = req.params.id;

    Movie.findById(id, function (err, movie) {
        res.json(movie);
    });
});

module.exports = router;
