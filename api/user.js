const router = require('express').Router();
const jwt = require('jsonwebtoken');
const hashPassword = require('../utils/hashPassword');

module.exports = (db) => {

    const User = require('../db/user')(db);

    // POST /users/create
    router.post('/create', async (request, response) => {
        try {
            const {username, password} = request.body;
            if (!username || !password) {
                return response.status(400).json({message: 'Invalid input.'});
            }
            const result = await User.create({username, password, voted: false, isAdmin: false});
            response.status(200).json({message: 'User created.'});
        } catch (e) {
            response.status(500).json({message: e.message});
        }
    });

    // POST /users/login
    router.post('/login', async (request, response) => {
        try {
            const {username, password} = request.body;
            const result = await User.get(username);
            const error = new Error();
            if (!(username && password)) {
                return response.status(400).json({message: 'Invalid input.'});
            }

            if (result === null) {
                return response.status(401).json({message: 'Invalid username or password.'});
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
                return response.status(401).json({message: 'Invalid username or password.'});
            }
        } catch (e) {
            response.status(500).json({message: e.message});
        }
    });

    return router;

};
