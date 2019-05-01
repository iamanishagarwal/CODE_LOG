const express = require('express')
const config = require('config')
const flash = require('express-flash')
const cookieParser = require('cookie-parser');
const session = require('express-session');
const methodOverride = require('method-override')

module.exports = function(app){
    // Checking whether the jwtKey environmental variable is defined or not for generating jwt Token.
    // If not exit
    if(!config.get('jwtKey')){
        console.log('jwtKey is not defined')
        process.exit(1)
    }

    //Middleware to serve static files
    app.use(express.static('public'))

    //For setting the default view engine to ejs
    app.set('view engine', 'ejs')
    app.set('views', './views')

    // Middleware for method-override
    app.use(methodOverride('_method'))

    /*
    * This module shows flash messages generally used to show success or error messages
    * Flash messages are stored in session. So, we also have to install and use cookie-parser & session modules
    */ 
    app.use(cookieParser('keyboard cat'))
    app.use(session({ 
        secret: 'keyboard cat',
        resave: false,
        saveUninitialized: true,
        cookie: { maxAge: 60000 }
    }))
    app.use(flash())
}