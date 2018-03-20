const router = require('express').Router();


module.exports = (db) => {

    const category = require('../db/category')(db);

    router.get('/votes', async(request, response) => {
        try{
            let result = await category.getCategories();
            response.status(200).json(result);
        }catch(e) {
            console.log("Error!");
            response.status(404).json({message:e.message});
        }
    });
    return router;
};
