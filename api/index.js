const router = require('express').Router();
const voteSchema = require("../schema/redCarpet");

const Validator = require('jsonschema').Validator;
const validator = new Validator();

module.exports = (db, io) => {

    const redCarpet = require('../db/redCarpet')(db);

    router.post('/categories', async (request, response) => {
        console.log(request.body);
        try{
            const category = request.body;
            const result = await redCarpet.addCategory(category);
            response.status(200).json({success: true});
        }
        catch(e){
            console.log("error");
        }
    });

    router.post('/nominees/:categoryId', async (request, response) => {
        const {categoryId} = request.params;
        const nominees = request.body;
        const result = await redCarpet.addNominees(categoryId, nominees);
        if (result.result.n === 0) {
            response.status(404).json({message: 'Category doesn\'t exist'});
        }
        else {
            response.status(200).json({success: true});
        }
    });

    router.post('/votes', async (request, response) => {
        try{
            const votes = request.body;
            const result = await redCarpet.addVotes(votes);
            response.status(200).json({success: true});
        }catch(e){
            console.log("error");
        }
    });

    router.get('/votes', async (request, response) => {
        try{
            const votes = await redCarpet.getAllVotes();
            response.json({votes});
        }catch(e){
            console.log("error")
        }

    });

    router.get('/votes/:categoryId', async (request, response) => {
        const categoryId = request.params.id;
        const result = redCarpet.getVotes(categoryId);
        response.json(result);
    });

    return router;

};
