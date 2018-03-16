const router = require('express').Router();

const newRedCarpetSchema = new require('../schema/red_carpet');
const Validator = require('jsonschema').Validator;
const validator = new validator();
module.exports = (db) => {
    const redCarpet = require('../db/red_carpet');
}