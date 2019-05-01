const mongoose = require('mongoose')
const config = require('config')

module.exports = function(){
    //Middleware for connecting to mongoDB
    mongoose.connect(config.get('db'), { useNewUrlParser: true })
    .then(() => console.log('Mongodb Connected......'))
    .catch((err) => console.log('Error while connecting to mongodb....'))
}
