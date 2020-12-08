const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const PORT = process.env.PORT || 4000;
const path = require('path');
const movieRoute = require('./routes/api/movieRoute');
const userRoute = require('./routes/api/userRoute');

dotenv.config();

app.use(cors());
app.use(bodyParser.json());

mongoose.connect(process.env.DB_URL, {
    useNewUrlParser: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
});

const connection = mongoose.connection;

connection.once('open', function () {
    console.log('MongoDB database connection established successfully');
});

app.use('/movies', movieRoute);
app.use('/api/account', userRoute);

app.use(express.static(path.join(__dirname, '../frontend/build')));
app.get('*', (req, res) => {
    console.log(__dirname);
    res.sendFile(path.join(__dirname, '../frontend/build/index.html'));
});

app.listen(PORT, function () {
    console.log('Server is running on Port: ' + PORT);
});
