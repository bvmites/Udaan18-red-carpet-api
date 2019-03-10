const express = require('express');
const bodyParser = require('body-parser');
const MongoClient = require('mongodb').MongoClient;
const debug = require('debug')('red-carpet:server');
const http = require('http');
const cors = require('cors');
const morgan = require('morgan');
const fs = require('fs');
const jwt = require('jsonwebtoken');

const index = require('./api/index');
const user = require('./api/user');
const feedback = require('./api/feedback');

const auth = require('./middleware/auth');

morgan.token('user', (request, response) => {
    try {
        const token = request.header('Authorization');
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        return decoded.user ? (decoded.user.username || 'INVALID') : 'INVALID';
    } catch (e) {
        console.log(e);
        return 'INVALID';
    }
});

const app = express();
app.use(cors());

app.use(morgan(':remote-addr :user [:date[clf]] ":method :url :status ":referrer"'));

const port = process.env.PORT || 3000;
const server = http.createServer(app);
const io = require('socket.io')(server).of('/charts');

app.use(bodyParser.json());

require('dotenv').config();

(async () => {
    try {

        const client = await MongoClient.connect(process.env.DB);
        const db = client.db('red-carpet-2019');
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
