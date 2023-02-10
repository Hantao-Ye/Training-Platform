// Loads the configuration from config.env to process.env
require('dotenv').config();

const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

const recordRoutes = express.Router();

const url = process.env.ATLAS_URI;
mongoose.connect(url);

const database = mongoose.connection;
database.on('error', (error) => {
    console.log(error)
})

database.once('connected', () => {
    console.log('Database Connected');
})

const PORT = process.env.PORT || 5000;
const app = express();

app.use(cors());
app.use(express.json());

const indexRouter = require('./routes/index');
const apiRouter = require('./routes/api');

app.use('/', indexRouter);
app.use('/api', apiRouter);

// Global error handling
app.use(function (err, _req, res, next) {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

// start the Express server
app.listen(PORT, () => {
    console.log(`Server is running on port: ${PORT}`);
});