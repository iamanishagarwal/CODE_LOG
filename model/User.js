const mongoose = require('mongoose')
const Joi = require('joi')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const config = require('config')

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
    }, 
    problemSolved: {
        type: Number,
        required: true
    }
})

userSchema.methods.generateToken = function(){
    const token = jwt.sign({_id: this._id}, config.get('jwtKey'))
    return token
}

userSchema.methods.comparePassword = async function(password){
    const match = await bcrypt.compare(password, this.password)
    return match
}

const User = mongoose.model('User', userSchema)

function  validateUser(user)
{
    const schema = {
        username: Joi.string().required(),
        password: Joi.string().required(),
        confirmPassword: Joi.string().required()
    }
    return Joi.validate(user, schema)
}

async function generatePassword(password){
    const salt = await bcrypt.genSalt(10)
    const hashPassword = await bcrypt.hash(password, salt)
    return hashPassword
}

module.exports.User = User
module.exports.validateUser = validateUser
module.exports.generatePassword = generatePassword