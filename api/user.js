const router = require('express').Router();
const jwt = require('jsonwebtoken');
const hashPassword = require('../utils/hashPassword');
const verifyUser = require('../utils/verifyUser');

module.exports = (db) => {

    const userDb = require('../db/user')(db);

    // POST /users/login
    router.post('/login', async (request, response) => {
        try {
            const {username, password} = request.body;
            if (!(username && password)) {
                return response.status(400).json({message: 'Invalid input.'});
            }
            if (verifyUser({username, password})) {
                const user = await userDb.get(username);
                if (user && user.voted) {
                    return response.status(403).json({message: 'You have already voted.'});
                }
                const payload = {
                    user: {
                        username,
                        voted: false,
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
