module.exports = (db) => ({
    add: ({name, rating, comment}) => {
        return db.collection('feedback').insertOne({name, rating, comment});
    }
});