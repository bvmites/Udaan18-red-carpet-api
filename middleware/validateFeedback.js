module.exports = (request, response, next) => {
    const {stars} = request.body;
    if (!stars) {
        return response.status(400).json({message: 'Invalid input.'});
    }
    next();
};
