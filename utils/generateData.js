const router = require('express').Router();


module.exports = (db) => {

    const category = require('../db/category')(db);

    router.get('/votes', async(request, response) => {
        try{
            const categoryId = request.body;
            let result = category.getCategories(categoryId);
            response.status(200).json(result.stringify);
        }catch(e) {
            console.log("Error!");
            response.status(404).json({message:e.message});
        }
    });
};