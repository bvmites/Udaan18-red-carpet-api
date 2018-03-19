const jwt = require('jsonwebtoken');

module.exports = (request, response, next) => {
    try {
        console.log("a");
        const token = request.header('Authorization');
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        request.user = decoded.user;
        if (request.user.voted) {
            throw new Error;
        }
        next();
    }
    catch (e) {
        response.status(401).json({message: 'unauthorized'});
    }
};
