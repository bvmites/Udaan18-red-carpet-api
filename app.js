const express = require('express');
const bodyParser = require('body-parser');
const MongoClient = require('mongodb').MongoClient;
const dotenv = require('dotenv');
const debug = require('debug')('red-carpet:server');
const http = require('http');

const index = require('./api/index');

const app = express();
const port = process.env.PORT || 3000;
app.set('port', port);
const server = http.createServer(app);
const io = require('socket.io')(server).of('/charts');

server.listen(port);

app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: false }));

dotenv.config();

(async () => {
    try {
        const client = await MongoClient.connect("mongodb://localhost/");
        const db = client.db('new_rc');
        console.log('Connectd to database.');
        app.use('/',index(db));
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