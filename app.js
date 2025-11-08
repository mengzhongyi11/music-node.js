const express = require('express')
const cors = require('cors')
const usrRouter = require('./router/user')
const config = require('./config')
const expressJWT = require('express-jwt')
const app = express()
const unless = require('express-unless')
const userinfoRouter = require('./router/userinfo')
const heartList = require('./router/red_heart')
const bodyParser = require('body-parser')
const datalist = require('./router/data')
const tranfer = require('./router/tranfer')
const dynamics = require('./router/dynamics')


app.use(cors())

app.use(express.json({ limit: '50mb' }))

app.use(express.urlencoded({ limit: '50mb', extended: true }))

app.use(expressJWT({ secret: config.jwtsSecreKey }).unless({ path: [/^\/api\//, /^\/data\//, /^\/user\//] }))

app.use(express.json());

app.use(express.urlencoded({ extended: false }))

app.use('/api', usrRouter)

app.use('/user', userinfoRouter)

app.use('/red', heartList)

app.use('/data', datalist)

app.use('/tranfer', tranfer)

app.use('/dynamics', dynamics)



app.listen(3001, () => {
    console.log('Running')
})