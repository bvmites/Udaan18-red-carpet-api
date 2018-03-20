const express = require('express');
const bodyParser = require('body-parser');
const MongoClient = require('mongodb').MongoClient;
const debug = require('debug')('red-carpet:server');
const http = require('http');
const cors = require('cors');

const index = require('./api/index');
const user = require('./api/user');
const data = require('./utils/generateData');
const auth = require('./middleware/auth');

const app = express();
app.use(cors());
const port = process.env.PORT || 3000;
const server = http.createServer(app);
const io = require('socket.io')(server).of('/charts');

app.use(bodyParser.json());

require('dotenv').config();

(async () => {
    try {
        const client = await MongoClient.connect(process.env.DB);
        const db = client.db('red-carpet');
        console.log('Connected to database.');
        app.use('/redcarpet', data(db));
        app.use('/user', user(db));
        app.use('/', auth, index(db, io));

        app.use(function (req, res, next) {
            const err = new Error('Not Found');
            err.status = 404;
            next(err);
        });

        app.use(function (err, req, res, next) {
            res.status(err.status || 500).json({message: err.message});
        });
    } catch (e) {
        console.error('Cannot connect', e.message);
    }
})();

server.listen(port);
