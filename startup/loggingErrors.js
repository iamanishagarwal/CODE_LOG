const winston = require('winston')
require('express-async-errors')

module.exports = function() {
    winston.handleExceptions(
        new winston.transports.File({ filename: 'uncaughtException.log'})
    )
    process.on('unhandledRejection', ex => {
        throw ex
    })
    winston.add(winston.transports.File, { filename : 'logfile.log' })
}