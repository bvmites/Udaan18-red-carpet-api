const router = require('express').Router();
const jwt = require('jsonwebtoken');
const hashPassword = require('../utils/hashPassword');

module.exports = (db) => {

    const User = require('../db/user')(db);

    // POST /users/create
    router.post('/create', async (request, response) => {
        try {
            const {username, password} = request.body;
            const result = await User.create({username, password, voted: false, isAdmin: false});
            response.status(200).json({message: 'User created.'});

        } catch (e) {
            response.status(500).json({message: e.message});
        }
    });

    // POST /users/login
    router.post('/login', async (request, response) => {
        console.log('login', request.body);
        try {
            const {username, password} = request.body;
            const result = await User.get(username);
            const error = new Error();
            if (!(username && password)) {
                error.message = 'Invalid request';
                error.code = 'MissingCredentials';
                throw error;
            }

            if (result === null) {
                error.message = 'Invalid username or password';
                error.code = 'UserDoesntExist';
                throw error;
            }

            if (result.password.hash === hashPassword(password, result.password.salt, result.password.iterations)) {

                if (result.voted) {
                    return response.status(403).json({message: 'You have already voted.'});
                }

                const payload = {
                    user: {
                        username: result._id,
                        isAdmin: result.isAdmin,
                        voted: result.voted,
                        userId: result._id
                    }
                };
                const token = jwt.sign(payload, process.env.JWT_SECRET, {expiresIn: process.env.JWT_EXPIRATION_TIME});
                response.status(200).json({token});
            }
            else {
                error.message = 'Invalid username or password';
                error.code = 'InvalidCredentials';
                throw error;
            }
        } catch (e) {
            if (e.code === 'MissingCredentials') {
                response.status(400);
            }
            else if (e.code in ['UserDoesntExist', 'InvalidCredentials']) {
                response.status(401);
            }
            else {
                response.status(500);
            }
            response.json({message: e.message});
        }
    });

    return router;

};
