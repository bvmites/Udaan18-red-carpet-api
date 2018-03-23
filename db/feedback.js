module.exports = (db) => ({
    add: ({stars, message}) => {
        console.log({stars, message});
        return db.collection('feedback').insertOne({stars, message});
    }
});