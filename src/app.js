const express = require('express')
const db = require("./config/database")
const jwt = require("jsonwebtoken")
const cookie = require("cookie-parser")
const bcrypt = require("bcrypt")
const app = express()
const User = require('./models/user')
const { validateInput, validateInputKeys} = require("./middlewares/validation")
const { validateToken } = require("./middlewares/validateToken")
const {authRouter } = require("./routes/authRoute")
const {profileRouter} = require("./routes/profileRoute")
const {connectionRouter} = require("./routes/connectionRequest")
const {userRouter}= require("./routes/userRoute")
const {feedRouter} = require("./routes/feed")
const cors = require("cors")

const corsOptions = {
    origin: "http://localhost:5173",
    credentials: true,
    optionSuccessStatus:200
}
app.use(cors(corsOptions))
app.use(express.json())
app.use(cookie())

db()
.then((resolve)=>{
    console.log("DB connected")
    app.listen(7777, ()=>{
        console.log("The server is listening on port 7777");
    })
}).catch((err)=>{
    console.error(err.message)
})

app.use('/',authRouter);
app.use('/',profileRouter)
app.use('/', connectionRouter)
app.use('/',userRouter)
app.use('/', feedRouter)




