const ObjectId = require('mongodb').ObjectId;

module.exports = (db) => ({

    addCategory: ({name}) => {
        return db.collection('categories').insertOne({name});
    },

    addNominees: (categoryId, nominees) => {
        return db.collection('nominees').insertMany(nominees.map(n => ({...n, categoryId: ObjectId(categoryId)})));
    },

    addVotes: async (votes, userId) => {
        const filter = votes.map(v => {
            return {
                _id: ObjectId(v.nomineeId),
                categoryId: ObjectId(v.categoryId)
            }
        });
        await db.collection('users').insertOne({_id: userId, voted: true});
        return db.collection('nominees').updateMany(
            {$or: filter},
            {$inc: {votes: 1}}
        );
    },

    getVotes: (categoryId) => {
        return db.collection('nominees')
            .find({categoryId})
            .toArray();
    },

    getAllVotes: () => {
        return db.collection('votes')
            .aggregate([
                {
                    $group: {
                        _id: '$categoryId',
                        nominees: {$push: {name: '$nomineeName', votes: '$votes'}}
                    }
                }
            ])
            .toArray();
    },

    getVoteSummary: () => {
        return db.collection('nominees')
            .aggregate([
                {$group: {_id: '$categoryId', votes: {$push: '$votes'}}},
                {$project: {categoryId: '$_id', votes: '$votes', _id: false}}
            ])
            .toArray();
    }

});
