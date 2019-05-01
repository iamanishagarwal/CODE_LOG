const express = require('express')
const app = express()

require('./startup/loggingErrors')()
require('./startup/db')()
require('./startup/config')(app)
require('./startup/prod')(app)
require('./startup/routes')(app)

var port = process.env.PORT || 3000
app.listen(port, () => {
    console.log(`The app is listening on port : ${port}`)
})
