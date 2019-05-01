const jwt = require('jsonwebtoken')
const config = require('config')

function auth(req, res, next){
    const token = req.cookies.token
    if(!token){
        req.flash('error_msg', 'Access denied. No token provided')
        return res.redirect('/')
    }

    try{
        const decoded = jwt.verify(token, config.get('jwtKey'))
        req.token = decoded
        next()
    }
    catch(ex){
        req.flash('error_msg', 'Invalid Access')
        return res.redirect('/')
    }
}

module.exports = auth