module.exports = (db) => async (request, response, next) => {
    const username = request.user.username;
    if (request.user.voted) {
        return response.status(403).json({message: 'You have already voted.'});
    }
    const user = await db.collection('users').findOne({_id: username});
    if (!user || (user && !user.voted)) {
        return next();
    }
    response.status(403).json({message: 'You have already voted.'});
};
