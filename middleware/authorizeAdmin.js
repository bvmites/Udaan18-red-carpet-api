module.exports = (request, response, next) => {
    if (request.user && request.user.isAdmin) {
        next();
    }
    else {
        response.status(403).json({message: 'unauthorized'});
    }
};