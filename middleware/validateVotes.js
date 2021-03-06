const Validator = require('jsonschema').Validator;
const validator = new Validator();

const voteSchema = require('../schema/vote');

module.exports = (request, response, next) => {
    try {
        const votes = request.body;
        if (!validator.validate(votes, voteSchema).valid) {
            console.log('invalid input');
            throw new Error();
        }
        const result = {};
        let flag = false;
        votes.forEach((i) => {
            if (result.hasOwnProperty(i.categoryId)) {
                flag = true;
            }
            else {
                result[i.categoryId] = true;
            }
        });
        if (flag) {
            throw new Error();
        }
        next();
    } catch (e) {
        response.status(401).json({message: "Invalid input"});
    }
};
