const ObjectId = require('mongodb').ObjectId;

module.exports = (db) => ({
   post: /*async*/(id,votes) => {
        const ans = db.collection('test_red').updateOne({_id : ObjectId(id)},{$inc{

            }});

   }
});