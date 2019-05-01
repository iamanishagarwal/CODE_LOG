const mongoose = require('mongoose')

module.exports = function(){
    //Middleware for connecting to mongoDB
    mongoose.connect('mongodb://localhost/code_log', { useNewUrlParser: true })
    .then(() => console.log('Mongodb Connected......'))
    .catch((err) => console.log('Error while connecting to mongodb....'))
}
