const jwt = require('jsonwebtoken');

module.exports = (request, response, next) => {
    try {
        const token = request.header('Authorization');
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        request.user = decoded.user;
        if (request.user.voted) {
            return response.status(403).json({message: 'You have already voted.'});
        }
        next();
    }
    catch (e) {
        response.status(401).json({message: 'unauthorized'});
    }
};
