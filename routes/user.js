const mongoose = require('mongoose')
const express = require('express')
const {User, validateUser, generatePassword} = require('../model/User')
const auth = require('../middleware/auth')
const router = express.Router()

router.get('/register', async (req, res) => {
    const users = await User.find().sort('username')
    return res.send(users);
})

router.post('/register', async (req, res) => {
    let user = await User.findOne({username: req.body.username})
    if(user){
        req.flash('error_msg', 'Username already exists')
        return res.redirect('/');
    }

    if(req.body.password !== req.body.confirmPassword)
    {
        req.flash('error_msg', 'Check Confirm Password')
        return res.redirect('/');
    }

    const {error} = validateUser(req.body)
    if(error){
        req.flash('error_msg', error.details[0].message)
        return res.redirect('/');
    }

    let password = await generatePassword(req.body.password);

    user = new User({
        username: req.body.username, 
        password: password,
        problemSolved: 0
    })

    try{
        user = await user.save()
        if(user)
        {
            const token = user.generateToken()
            res.cookie('token', token, {httpOnly: true})
            res.cookie('userId', user._id)
            req.flash('success_msg', 'User Successfully Registered')
            return res.redirect('/')
        }
    }
    catch(er){
        console.log(er)
    }
})

router.post('/login', async  (req,res) => {
    let user = await User.findOne({username: req.body.username})
    if(!user){
        req.flash('error_msg', 'Invalid Credential')
        return res.redirect('/')
    }

    const match = await user.comparePassword(req.body.password);
    if(!match){
        req.flash('error_msg', 'Invalid Credential')
        return res.redirect('/')
    }
    
    if(match){
        const token = user.generateToken()
        res.cookie('token', token, {httpOnly: true})
        res.cookie('userId', user._id)
        req.flash('success_msg', 'User Successfully LoggedIn')
        return res.redirect('/')
    }
})

router.get('/logout', auth, (req, res) => {
    res.clearCookie('token')
    res.clearCookie('userId')
    req.flash('success_msg', 'User Successfully Logged Out.')
    return res.redirect('/')
})

module.exports = router