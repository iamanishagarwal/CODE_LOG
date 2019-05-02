const mongoose = require('mongoose');
const joi = require('joi');

const problemSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    link : {
        type: String,
        required: true
    },
    tag : {
        type: String, 
        required: true
    },
    timeTaken: {
        type: String,
        required: false
    },
    rating: {
        type: Number,
        required: true
    },
    note: {
        type: String,
        required: false
    },
    userId: {
        type: String, 
        required: true
    }
});

const Problem = mongoose.model('Problem', problemSchema);

function validateProblem(problem)
{
    const schema = {
        name: joi.string().required(),
        link: joi.string().required(),
        tag: joi.string(),
        timeTaken: joi.string().max(9).allow(''),
        rating: joi.number().integer().required().min(1).max(10),
        note: joi.string().allow(''),
        _method: joi.string().allow('')
    }
    return joi.validate(problem, schema);
}

module.exports.Problem = Problem;
module.exports.validateProblem = validateProblem;

