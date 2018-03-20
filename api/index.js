const router = require('express').Router({});
const voteSchema = require('../schema/vote');
const validateVotes = require('../middleware/validateVotes');

module.exports = (db, io) => {

    const redCarpet = require('../db/redCarpet')(db);

    router.post('/categories', async (request, response) => {
        try {
            if (request.user.isAdmin === true) {
                const category = request.body;
                const result = await redCarpet.addCategory(category);
                response.status(200).json({success: true});
            } else {
                response.status(401).json({message: "Sorry! you are not Admin"})
            }
        }
        catch (e) {
            response.status(403).json({message: 'forbidden'});
        }
    });

    router.post('/nominees/:categoryId', async (request, response) => {
        try {
            if (request.user.isAdmin === true) {
                const {categoryId} = request.params;
                const nominees = request.body;
                const result = await redCarpet.addNominees(categoryId, nominees);
                if (result.result.n === 0) {
                    response.status(404).json({message: 'Category doesn\'t exist'});
                }
                else {
                    response.status(200).json({success: true});
                }
            } else {
                response.sendStatus(403).json({message: "forbidden"});
            }
        }
        catch (e) {
            response.status(500).json({message: e.message});
        }
    });

    router.post('/votes', validateVotes, async (request, response) => {
        try {
            const votes = request.body;
            console.log(request.user);
            const result = await redCarpet.addVotes(votes, request.user.userId);
            response.status(200).json({success: true});
            const voteSummary = await redCarpet.getVoteSummary();
            const voteSummaryWithKeys = {};
            for (let v of voteSummary) {
                voteSummaryWithKeys[v.categoryId] = v.votes;
            }
            io.emit('vote', voteSummaryWithKeys);
        } catch (e) {
            response.status(500).json({message: e.message});
        }
    });

    return router;

};
