const router = require('express').Router();
const voteSchema = new require('../schema/redCarpet');

const Validator = require('jsonschema').Validator;
const validator = new validator();

module.exports = (db) => {

    const redCarpet = require('../db/redCarpet')(db);

    router.post('/categories', async (request, response) => {
        const category = request.body;
        const result = await redCarpet.addCategory(category);
        response.status(200).json({success: true});
    });

    router.post('/nominees/:categoryId', async (request, response) => {
        const {categoryId} = request.params;
        const nominees = request.body;
        const result = await redCarpet.addNominees(categoryId, nominees);
        response.status(200).json({success: true});
    });

    router.post('/votes', async (request, response) => {
        const votes = request.body;
        const result = await redCarpet.addVotes(votes);
        response.status(200).json({success: true});
    });

    router.get('/votes', async (request, response) => {
        const votes = await redCarpet.getAllVotes();
        response.json({votes});
    });

    router.get('/votes/:categoryId', async (request, response) => {
        const categoryId = request.params.id;
        const result = redCarpet.getVotes(categoryId);
        response.json(result);
    });

    return router;

};
