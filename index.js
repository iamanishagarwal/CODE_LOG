const express = require('express')
const app = express()

require('./startup/loggingErrors')()
require('./startup/db')()
require('./startup/config')(app)
require('./startup/prod')(app)
require('./startup/routes')(app)

app.listen(3000, () => {
    console.log("The app is running on Port 3000");
})
