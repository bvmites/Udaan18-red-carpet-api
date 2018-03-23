module.exports = (request, response, next) => {
    const {rating} = request.body;
    if (!rating) {
        return response.status(400).json({message: 'Invalid input.'});
    }
    next();
};
