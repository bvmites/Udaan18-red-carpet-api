const router = require('express').Router({});
const auth = require('../middleware/auth');
const validateFeedback = require('../middleware/validateFeedback');

module.exports = (db) => {

    const feedback = require('../db/feedback')(db);

    router.post('/', auth, validateFeedback, async (request, response) => {
        try {
            const {name, rating, comment} = request.body;
            const result = await feedback.add({name, rating, comment});
            response.status(200).json({success: true});
        } catch (e) {
            response.status(500).json({message: e.message})
        }
    });

    return router;
};