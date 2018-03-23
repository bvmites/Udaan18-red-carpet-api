const express = require('express');
const bodyParser = require('body-parser');
const MongoClient = require('mongodb').MongoClient;
const debug = require('debug')('red-carpet:server');
const http = require('http');
const cors = require('cors');
const morgan = require('morgan');

const index = require('./api/index');
const user = require('./api/user');
const feedback = require('./api/feedback');

const auth = require('./middleware/auth');

const app = express();
app.use(cors());
app.use(morgan('combined'));

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
        app.use('/user', user(db));
        app.use('/feedback', feedback(db));
        app.use('/', auth, index(db, io));

        app.use((req, res, next) => {
            const err = new Error('Not Found');
            err.status = 404;
            next(err);
        });

        app.use((err, req, res, next) => {
            res.status(err.status || 500).json({message: err.message});
        });
    } catch (e) {
        console.error('Cannot connect', e.message);
    }
})();

server.listen(port);
