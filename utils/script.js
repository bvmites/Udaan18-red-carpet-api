const fs = require('fs');
const Mongoclient = require('mongodb').MongoClient;
const dotenv = require('dotenv');

dotenv.config();

Mongoclient.connect(process.env.DB, async (error, client) => {
    if (error) {
        console.log("Error!");
    } else {
        db = client.db('red-carpet');
        const data = require('../db/category')(db);
        const result = await data.getCategories();
        let file = fs.writeFileSync('./data.json', JSON.stringify(result));
    }
    console.log('Done');
    process.exit(0);
});
