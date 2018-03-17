const express = require('express');
const bodyParser = require('body-parser');
const MongoClient = require('mongodb').MongoClient;
const dotenv = require('dotenv');
const debug = require('debug')('red-carpet:server');
const http = require('http');

const index = require('./api');

const app = express();
const port = process.env.PORT || 3000;
app.set('port', port);
const server = http.createServer(app);
const io = require('socket.io')(server).of('/charts');

server.listen(port);

app.use(bodyParser.json());

dotenv.config();

(async () => {
    try {
        const client = await MongoClient.connect(process.env.DB);
        const db = client.db;
        console.log('Connected to database.');
        app.use('/redcarpet', index(db, io));
        app.use(function (req, res, next) {
            let err = new Error('Not Found');
            err.status = 404;
            next(err);
        });

        app.use(function (err, req, res, next) {
            res.locals.message = err.message;
            res.locals.error = req.app.get('env') === 'development' ? err : {};
            res.status(err.status || 500);
        });
    } catch (e) {
        console.log('Cannot connect');
        console.log(e);
    }
})();

module.exports = app;