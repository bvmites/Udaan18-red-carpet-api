const router = require('express').Router({});
const voteSchema = require('../schema/vote');
const validateVotes = require('../middleware/validateVotes');
const authorizeAdmin = require('../middleware/authorizeAdmin');
const checkVoteStatus = require('../middleware/checkVoteStatus');

module.exports = (db, io) => {

    const redCarpet = require('../db/redCarpet')(db);

    io.on('connection', async () => {
        const voteSummary = await redCarpet.getVoteSummary();
        io.emit('init', voteSummary);
    });

    router.post('/categories', authorizeAdmin, async (request, response) => {
        try {
            const category = request.body;
            const result = await redCarpet.addCategory(category);
            response.status(200).json({success: true});
        }
        catch (e) {
            response.status(500).json({message: e.message});
        }
    });

    router.post('/nominees/:categoryId', authorizeAdmin, async (request, response) => {
        try {
            const {categoryId} = request.params;
            const nominees = request.body;
            const result = await redCarpet.addNominees(categoryId, nominees);
            response.status(200).json({success: true});
        }
        catch (e) {
            response.status(500).json({message: e.message});
        }
    });

    router.post('/votes', validateVotes, checkVoteStatus(db), async (request, response) => {
        console.log('votes', request.body);
        try {
            const votes = request.body;
            const result = await redCarpet.addVotes(votes, request.user.userId);
            response.status(200).json({success: true});
            const voteSummary = await redCarpet.getVoteSummary();
            io.emit('vote', voteSummary);
        } catch (e) {
            response.status(500).json({message: e.message});
        }
    });

    return router;

};
