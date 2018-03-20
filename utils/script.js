const fs = require('fs');
const Mongoclient = require('mongodb').MongoClient;
const dotenv = require('dotenv');

dotenv.config();

const Client = Mongoclient.connect(process.env.DB, async (error,client)=>{
    if(error){
        console.log("Error!");
    }else{
        db = client.db('red-carpet');
        const data = require('../db/category')(db);
        const result = await data.getCategories();
        let file = fs.writeFileSync('./File.json',JSON.stringify(result));
    }
    // db = client.db('red-carpet');
    // const data = require('../db/category')(db);
    // const result = data.getCategories();
    // let file = fs.writeFileSync('./File.json',result);
});
