const ObjectId = require('mongodb').ObjectId;

module.exports = (db) => {

    getCategories : (categories_id) => {
        let result = db.collection('categories').group([nominees],
            {categoryId:ObjectId(categories_id)},
            {categoryName:name});
        console.log(result);
        return result;
    };
};