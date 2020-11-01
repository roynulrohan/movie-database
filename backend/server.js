const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const movieRoutes = express.Router();
const dotenv = require('dotenv');
const PORT = 4000;

let Movie = require('./models/Movie');
dotenv.config();
app.use(cors());
app.use(bodyParser.json());

mongoose.connect(process.env.DB_URL, { useNewUrlParser: true });

const connection = mongoose.connection;

connection.once('open', function () {
    console.log('MongoDB database connection established successfully');
});

movieRoutes.route('/').get(function (req, res) {
    Movie.find(function (err, movies) {
        if (err) {
            console.log(err);
        } else {
            res.json(movies);
        }
    }).limit(30);
});

movieRoutes.route('/movies').get(function (req, res) {
    const { title, genre, year, minRating } = req.query;
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

movieRoutes.route('/movie/:id').get(function (req, res) {
    let id = req.params.id;

    Movie.findById(id, function (err, movie) {
        res.json(movie);
    });
});

app.use('/', movieRoutes);

app.listen(PORT, function () {
    console.log('Server is running on Port: ' + PORT);
});
