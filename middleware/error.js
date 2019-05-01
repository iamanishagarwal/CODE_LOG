const winston = require('winston')

module.exports = function(err, req, res, next){
    winston.error(err.message, err)
    req.flash('error_msg', 'Something Went Wrong')
    return res.redirect('/')
}