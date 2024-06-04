require('dotenv').config()
const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const mongoose = require('mongoose')

// Files Configuration
app.set('view engine', 'ejs')
app.set('views', __dirname + '/views')
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use('/assets', express.static(__dirname + '/views/assets'));


// Routes
const indexRouter = require('./routes/index')
const signupRouter = require('./routes/signup')
const loginRouter = require('./routes/login')
const orderRouter = require('./routes/orderdetail')
const profileRouter = require('./routes/profile')
const homeRouter = require('./routes/home')
const adminRouter = require('./routes/admin')
const cookieParser = require('cookie-parser')

app.use('/', indexRouter)
app.use('/', signupRouter)
app.use('/', loginRouter)
app.use('/',orderRouter)
app.use('/',profileRouter)
app.use('/',homeRouter)
app.use('/', adminRouter)
app.use(cookieParser())

app.get('/getcookie', async function (req, res) {
    console.log(await req.cookies)
    res.send(await req.cookies);
})

// Database connection
mongoose.connect(process.env.DATABASE_URL, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log("Database Connected")
    })
    .catch((err) => {
        console.error("Database Connection Error:", err)
    })

// Starting server
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`)
})
