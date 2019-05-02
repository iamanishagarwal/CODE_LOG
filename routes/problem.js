const mongoose = require('mongoose');
const express = require('express');
const router = express();
const {Problem, validateProblem} = require('../model/Problem')
const {User, validateUser, generatePassword} = require('../model/User')
const auth = require('../middleware/auth')

router.post('/', auth, async (req, res) => {
    if(req.body.tag == null || req.body.tag == '')
        req.body.tag = "No specific tag";

    let {error} = validateProblem(req.body)
    if(error){
        req.flash('error_msg', error.details[0].message)
        return res.redirect('/');
    }

    let problem = null
    problem = await Problem.findOne({ $and: [{'userId': req.token._id}, {'link': req.body.link}]})
    
    if(problem)
    {
        req.flash('error_msg', 'Problem Link Already Registered.')
        return res.redirect('/');
    }

    let newProblem = new Problem({
        name: req.body.name,
        link: req.body.link,
        tag: req.body.tag,
        timeTaken: req.body.timeTaken,
        rating: req.body.rating,
        note: req.body.note,
        userId: req.token._id
    })
    try{
        newProblem = await newProblem.save()
        console.log('Problem successfully added');
        req.flash('success_msg', 'Problem Successfully Added')
        let user = await User.findOne({_id: req.token._id})
        let problemSolved = user.problemSolved
        user = await User.updateOne({_id: req.token._id}, {
            $set: {problemSolved: problemSolved+1}
        })
        req.flash('problem_solved', user.problemSolved)
        return res.redirect('/');
    }
    catch(er){
            console.log(er);
    }
})


router.get('/', auth, async (req, res) => {    
    const problem = false
    const problems = await Problem.find({userId: req.token._id}).sort('name')
    return res.render('problem/list', {problems: problems, selectedProblem: problem})
})


router.get('/:id', auth, async (req, res) => {
    let problem = null
    problem = await Problem.findOne({ $and: [{userId:  req.token._id}, {_id: req.params.id}]})
    if(!problem){
        req.flash('error_msg', 'Invalid Problem Id')
        return res.redirect('/problem')
    }
    else{
        const problems = await Problem.find({userId: req.token._id}).sort('name')
        return res.render('problem/list', {problems: problems, selectedProblem: problem})
    }
})


router.put('/:id', auth, async (req, res) => {
    let editedProblem = true
    editedProblem = await Problem.findOne({ $and: [{userId:  req.token._id}, {_id: req.params.id}]})
    if(!editedProblem){
        req.flash('error_msg', 'Invalid Problem Id')
        return res.redirect('/problem')
    }

    if(req.body.tag == null || req.body.tag == '')
        req.body.tag = "No specific tag";

    let {error} = validateProblem(req.body)
    if(error){
        req.flash('error_msg', "Problem couldn't be edited.", error.details[0].message)
        return res.redirect('/problem')
    }

    let problemCount = 10
    problemCount = await Problem.findOne({ $and: [{'userId': req.token._id}, {'link': req.body.link}]}).count()
    if(problemCount > 1)
    {
        req.flash('error_msg', 'Problem Link Already Registered.')
        return res.redirect('/problem');
    }

    try{
        let editedProblem = await Problem.updateOne({ $and: [{userId:  req.token._id}, {_id: req.params.id}]}, {
            $set: 
            {
                    name: req.body.name,
                    link: req.body.link,
                    tag: req.body.tag,
                    timeTaken: req.body.timeTaken,
                    rating: req.body.rating,
                    note: req.body.note,
                    userId: req.token._id
            }
        })

        req.flash('success_msg', 'Problem Successfully Edited')
    }
    catch(ex){
        req.flash('Error occured while updating editing problem.')
        console.log(ex)
    }
    return res.redirect('/problem')
})


router.delete('/:id', auth, async (req, res) => {
    try{
        const problem = await Problem.deleteOne({ $and: [{userId:  req.token._id}, {_id: req.params.id}]})
        req.flash('success_msg', 'Problem Successfully Deleted')
    }
    catch(er){
        req.flash('Unable to delete the problem.')
        console.log(er)
    }
    return res.redirect('/')
})

module.exports = router