const express = require('express')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const problem = require('../routes/problem')
const user = require('../routes/user')
const {Problem, validateProblem} = require('../model/Problem')
const error = require('../middleware/error')

module.exports = function(app){
    // parse application/x-www-form-urlencoded
    app.use(bodyParser.urlencoded({ extended: false })) 
    // parse application/json
    app.use(bodyParser.json())
    app.get('/', async (req, res) => {
        if(req.cookies['token'])
        {
            req.flash('loggedIn', 'true')
            let problemSolved = await Problem.find({userId: req.cookies['userId']}).count()
            let lastProblem = await Problem.find({userId: req.cookies['userId']}).sort({_id:-1}).limit(1)
            if(problemSolved > 0){
                const date =  lastProblem[0]._id.getTimestamp()
                req.flash('problem_solved', problemSolved)
                req.flash('lastProblem_time', date)
            }
        }
        else
            req.flash('loggedIn', 'false')
    
        return res.render('index')
    })
    app.use('/user', user)
    app.use('/problem', problem)
    app.use(error)
}