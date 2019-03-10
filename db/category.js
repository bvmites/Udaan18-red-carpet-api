const ObjectId = require('mongodb').ObjectId;

module.exports = (db) => ({

    getCategories: async () => {
        console.log('a');
        const collection = db.collection('nominees');
        const result = await collection.aggregate([{
            '$group': {
                "_id": "$categoryId",
                // "name": "",
                "nominees": {$push: {"_id": "$_id", "name": "$nomineeName", "imgUrl": "$imageUrl"}}
            }
        }]).toArray();
        // console.log(result);

        const categories = await db.collection('categories').find({}).toArray();

        const answer = result.map(category => {
            const categoryId = category._id;
            const foundCategory = categories.find((c) => c._id.toString() === categoryId.toString());
            console.log(foundCategory);
            if (foundCategory) {
                return {...category, title: foundCategory.category_name};
            }
            return category;
        });
        console.log(answer);
        return answer;
    }
});